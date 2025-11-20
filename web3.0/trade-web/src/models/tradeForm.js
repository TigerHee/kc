/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import * as ws from '@kc/socket';
import base from 'common/models/base';
import workerSocket from 'common/utils/socketProcess';
import storage from 'utils/storage';
import { _t } from 'utils/lang';
import { checkIsMargin, TRADE_TYPES_CONFIG } from 'utils/hooks/useTradeTypes';
import moment from 'moment';
import * as TradeSer from 'services/trade.js';
import { getFeeBySymbol, getSymbolTick } from 'services/markets.js';
import { pullSymbol } from 'services/symbols.js';
import _ from 'lodash';
import { BORROW_TYPE } from 'pages/Trade3.0/components/TradeBox/TradeForm/const';
import marketSnapshotStore from 'src/pages/Trade3.0/stores/store.marketSnapshot';
import { sleep, Decimal, convertMaintenanceJSON, getCurrentTime, isOutOfTimeRange } from 'helper';
import { delay } from 'utils/delay';
import sentry from '@kc/sentry';
import { MARGIN_ORDER_MODE_ENUM } from '@/pages/OrderForm/config';

const { AUTO_BORROW, AUTO_REPAY, AUTO_BORROW_AND_REPAY } = MARGIN_ORDER_MODE_ENUM;

// 数字字符串转换为数字
const numstrToNumber = (str) => {
  if (str === undefined || str === null || Number.isNaN(+str)) {
    return str;
  }
  return new Decimal(str).toFixed();
};

// 获取杠杆默认下单模式
const getDefaultMarginOrderMode = (key) => {
  const dataFromStorage = storage.getItem(key);
  return MARGIN_ORDER_MODE_ENUM[dataFromStorage] ? dataFromStorage : AUTO_BORROW;
};

export default extend(base, {
  namespace: 'tradeForm',
  state: {
    feeInfoMap: {},
    agreedRisk: false,
    showRiskModal: false,
    priceLimitRate: null,
    type: 'customPrise', // 交易类型
    [TRADE_TYPES_CONFIG.MARGIN_TRADE.borrowTypeKey]: 'manual', // 借贷类型 auto | manual
    [TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.borrowTypeKey]: 'manual', // 借贷类型 auto | manual
    leverUnit: 5, // 杠杆倍数
    // symbolFee: {},
    tradeType: 'TRADE',
    maintenanceStatus: {}, // 系统维护的状态
    formValues: {
      // 表单值，暂存
    },
    // 杠杆和逐仓对应买卖单的下单模式 normal | borrow | repay
    marginOrderModeBuy: getDefaultMarginOrderMode('marginOrderModeBuy'),
    marginOrderModeSell: getDefaultMarginOrderMode('marginOrderModeSell'),
    isolatedOrderModeBuy: getDefaultMarginOrderMode('isolatedOrderModeBuy'),
    isolatedOrderModeSell: getDefaultMarginOrderMode('isolatedOrderModeSell'),
    isOldAutoReay: false, // 兼容老板本的自动还币
    timeWeightedOrderConfig: {}, // 时间加权委托下单配置
  },
  reducers: {
    updateTradeForm(state, { payload: { tradeForm } }) {
      return {
        ...state,
        tradeForm,
      };
    },
    deepUpdateTradeForm(state, { payload = {} }) {
      const { tradeForm } = state;
      return {
        ...state,
        tradeForm: {
          ...tradeForm,
          ...payload,
        },
      };
    },
    updateFeeInfo(state, { payload: { feeInfo } }) {
      return {
        ...state,
        feeInfoMap: {
          ...state.feeInfoMap,
          [feeInfo.symbol]: feeInfo.data,
        },
      };
    },
  },
  effects: {
    *init({ payload }, { put }) {
      const marginBorrowTypeFromStorage = storage.getItem(
        TRADE_TYPES_CONFIG.MARGIN_TRADE.borrowTypeKey,
      );
      const isolatedBorrowTypeFromStorage = storage.getItem(
        TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.borrowTypeKey,
      );
      const initMarginBorrowType = BORROW_TYPE[marginBorrowTypeFromStorage]
        ? marginBorrowTypeFromStorage
        : 'manual';
      const initIsolatedBorrowType = BORROW_TYPE[isolatedBorrowTypeFromStorage]
        ? isolatedBorrowTypeFromStorage
        : 'manual';
      yield put({
        type: 'update',
        payload: {
          [TRADE_TYPES_CONFIG.MARGIN_TRADE.borrowTypeKey]: initMarginBorrowType,
          [TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.borrowTypeKey]: initIsolatedBorrowType,
        },
      });
    },
    *getPriceLimitRate({ payload: { symbol } }, { put, call, select }) {
      const { data = {} } = yield call(pullSymbol, { code: symbol });
      yield put({
        type: 'update',
        payload: {
          priceLimitRate: data.priceLimitRate,
        },
      });
    },
    // 设置买卖的价格
    *setFast({ payload = {}, setType }, { put }) {
      const { price, amount } = payload;
      const map = {
        price: 'toSetPrice',
        amount: 'toSetAmount',
      };
      console.log(
        {
          [map[setType]]: payload[setType],
        },
        payload,
        setType,
      );
      yield put({
        type: 'update',
        payload: {
          [map[setType]]: payload[setType],
          [`${map[setType]}UpdateTime`]: Date.now(),
        },
      });
    },
    /**
     * 发布委托
     * 是否自动还币现在跟随每一个订单，之前是一个开关控制全量的
     * 自动借币是一个单独的接口
     */
    *createConsignation({ payload }, { call, select, put }) {
      // const { currentCoinPair, currentCoin, currentPair } = yield select(state => state.tradeV2);
      // const {} = payload
      // isQuickOrder 是否快速下单
      const {
        formValues,
        coinPair,
        params,
        byQuantity,
        isQuickOrder,
        currentMarginOrderMode,
        remark,
      } = payload;
      const LoadingKey = isQuickOrder ? 'loading_quick_' : 'loading_';
      const { tradeType: orderType, side, showAdvanced } = formValues;
      const tradeFormState = yield select((state) => state.tradeForm);
      const { tradeType } = yield select((state) => state.trade);
      const { [`advanceSettings_${side}`]: advanceSettings } = yield select(
        (state) => state.tradeForm,
      );
      const isMargin = checkIsMargin(tradeType);
      const { borrowTypeKey } = TRADE_TYPES_CONFIG[tradeType] || {};

      let advanceSetting = (showAdvanced !== false && advanceSettings) || {};
      let result = null;

      yield put({
        type: 'symbols/addSymbols',
        payload: {
          symbol: coinPair,
        },
      });
      let sentryParams;
      try {
        const typeMap = {
          customPrise: 'limit', // 限价交易
          marketPrise: 'market', // 市价交易
          triggerPrise: 'limit', // 限价止盈止损
          marketTriggerPrice: 'market', // 市价止盈止损
        };
        yield put({
          type: 'update',
          payload: {
            [`${LoadingKey}${side}`]: true,
          },
        });

        const _tType = typeMap[orderType];

        // 是否是止盈止损单
        const isStop = /trigger/gi.test(orderType);
        const isOCO = orderType === 'ocoPrise';
        // 跟踪委托
        const isTSO = orderType === 'tsoPrise';

        if (_tType === 'market' || isTSO) {
          advanceSetting = {};
        }

        // 是否是时间加权委托
        const isTimeWeightedOrder = orderType === 'timeWeightedOrder';

        // (advanceSetting.ph ? [advanceSetting.ph] : []).forEach((c) => {
        //   advanceSetting[c.toLowerCase()] = true;
        // });
        // 兼容v2 ph 值为数组的情况
        if (advanceSetting.ph) {
          let _ph = [];
          if (_.isArray(advanceSetting.ph)) {
            _ph = [...advanceSetting.ph];
          } else {
            _ph = [advanceSetting.ph];
          }
          _ph.forEach((c) => {
            advanceSetting[c.toLowerCase()] = true;
          });
        }

        let currentPrice;
        // sokect正常连接并且topic_state为1时，最新价从推送中取, 否则从接口取
        const connected = yield workerSocket.connected();
        if (connected) {
          const topic = ws.Topic.get(ws.Topic.MARKET_SNAPSHOT, {
            SYMBOLS: [coinPair],
          });

          const wsState = yield workerSocket.getTopicState();
          if (wsState) {
            const { topicStateConst, topicState } = wsState;

            const topicStateData = topicStateConst.SUBSCRIBED;
            if (topicState[topic] && topicState[topic].status === topicStateData) {
              const marketSnapshot = yield marketSnapshotStore.handler.select(
                (state) => state.marketSnapshot,
              );
              currentPrice = (marketSnapshot[coinPair] || {}).lastTradedPrice || 0;
            }
          }
        }
        if (!currentPrice) {
          const { data } = yield call(getSymbolTick, { symbols: coinPair });
          const { lastTradedPrice = 0 } = _.find(data, (v) => v.symbol === coinPair) || {};
          currentPrice = lastTradedPrice;
        }
        // const currentPrice = 0;

        // 是否是止盈止损
        // const isSTSL = formValues.tradeType === 'marketTriggerPrice' || formValues.tradeType === 'triggerPrise';
        // 条件加上currentPrice， 因为错的currentPrice可能会导致用户下单被错误的撮合，而不传stop只会导致下单失败
        const normalStop =
          formValues && formValues.triggerPrice && currentPrice
            ? +formValues.triggerPrice > +currentPrice
              ? 'entry'
              : 'loss'
            : undefined;
        const OCOStop =
          formValues && formValues.triggerPrice && currentPrice
            ? +formValues.limitPrice > +currentPrice
              ? 'e_oco'
              : 'l_oco'
            : undefined;
        const _stop = isOCO ? OCOStop : normalStop;
        // 是否是隐藏单(隐藏单显示数量为 0)
        const isHidden = +advanceSetting.showAmount === 0;

        // 每种交易类型需要的键
        // const keysToDelMap = {
        //   customPrise: [],
        //   marketPrise: [],
        //   triggerPrise: [],
        //   marketTriggerPrice: [],
        // };

        const getCancelAfter = (time) => {
          if (!time) {
            return 0;
          }
          const momentDate = moment(time);
          if (momentDate && momentDate.format) {
            const numArr = momentDate.format('HH:mm:ss').match(/\d{2}/g);
            return numArr[0] * 60 * 60 + numArr[1] * 60 + +numArr[2];
          } else {
            return momentDate;
          }
        };
        let opts = {};
        if (isTimeWeightedOrder) {
          opts = {
            ...formValues,
            type: _tType, // 类型: limit:限价单, market:市价单
            symbol: coinPair, // symbol 交易对编码
            channel: 'WEB', // 渠道
            tradeType: 'TRADE',
            remark, // xkucoin标识 --- miniApp
          };
        } else {
          opts = {
            type: _tType, // 类型: limit:限价单, market:市价单
            price: numstrToNumber(formValues.price), // 订单交易价格
            symbol: coinPair, // symbol 交易对编码
            channel: 'WEB', // 渠道
            // funds: '',                // 订单交易金额, 市价单使用（暂不支持，传空）
            hidden: advanceSetting.hidden && isHidden, // 隐藏单(可选): false:不开启 true:开启
            iceberg: advanceSetting.hidden && !isHidden, // 冰山单(可选): false:不开启 true:开启
            postOnly: !!advanceSetting.postonly || formValues.timeInForce === 'GTC', // 开启表示如果下单有能立即成交的对手方，则取消订单, 不以 taker 身份成交
            side: formValues.side, // 交易方向: buy: 买 sell: 卖
            size: numstrToNumber(formValues.amount), // 订单交易数量
            stop: _stop, // 止盈止损类型(可选): entry: 止盈, loss: 止损， oco订单  e_oco: OCO止盈, l_oco: OCO止损, 开启后需要指定止盈止损触发价格，tso: 跟踪委托
            stopPrice: numstrToNumber(formValues.triggerPrice), // 止盈止损触发价格, 止盈止损类型订单必填。
            limitPrice: numstrToNumber(formValues.limitPrice), // oco订单限价，可以理解为压力位价格，突破后下单。
            timeInForce: advanceSetting.timeStrategy || formValues.timeInForce, // 限时单类型(可选): GTC : Good till cancel，用户主动取消才过期； GTT：Good till time，指定时间后过期； IOC：Immediately orcancel，立即成交可成交的部分，然后取消剩余部分，不进入买卖盘； FOK：Fill or kill，如果下单不能全部成交，则取消；
            visibleSize: numstrToNumber(advanceSetting.showAmount), // 冰山单设置可见部分最大数量, 冰山单必填
            cancelAfter: getCancelAfter(advanceSetting.usefulLife), // 自动过期时间，单位秒 限时单类型中的GTT类型使用, -1 表示不限时
            remark, // xkucoin标识 --- miniApp
          };
        }

        if (isMargin || isStop) {
          // 如果是杠杆交易，或者下止损单，添加下单类型
          opts.tradeType = tradeType;
          // opts.leverage = tradeFormState.leverUnit;
        }
        // 高级模式可以收起
        // if (!advancedMode) {
        //   // 删除多余的参数
        //   ['cancelAfter', 'visibleSize', 'timeInForce', 'iceberg', 'hidden'].forEach((k) => {
        //     delete opts[k];
        //   });
        // }
        if (!byQuantity && opts.side === 'buy' && _tType === 'market') {
          opts.funds = opts.size;
          delete opts.size;
        }
        if (['undefined', 'null', 'NaN'].indexOf(opts.stopPrice) > -1) {
          delete opts.stopPrice;
        }
        if (opts.timeInForce !== 'GTT') {
          delete opts.cancelAfter;
        }
        if (_tType === 'market') {
          delete opts.price;
        }
        if (!advanceSetting.hidden) {
          delete opts.visibleSize;
        }
        if (!isOCO) {
          delete opts.limitPrice;
        }
        Object.assign(opts, params || {});
        sentryParams = { reqParams: opts };
        let serviceFunc;
        // 是否自动借币模式
        const isOpenAutoBorrow =
          isMargin && [AUTO_BORROW, AUTO_BORROW_AND_REPAY].includes(currentMarginOrderMode);
        // 是否自动还币模式
        const isOpenAutoRepay =
          isMargin && [AUTO_REPAY, AUTO_BORROW_AND_REPAY].includes(currentMarginOrderMode);
        const addMarginOrderModeParams = (paramsList = ['autoBorrow', 'autoRepay']) => {
          if (isOpenAutoBorrow && paramsList.includes('autoBorrow')) {
            opts.autoBorrow = true;
          }
          if (isOpenAutoRepay && paramsList.includes('autoRepay')) {
            opts.autoRepay = true;
          }
        };
        if (isOCO) {
          // OCO下单
          addMarginOrderModeParams();
          serviceFunc = isMargin ? TradeSer.marginOcoOrder : TradeSer.ocoOrder;
        } else if (isTSO) {
          // TSO下单
          addMarginOrderModeParams();
          serviceFunc = isMargin ? TradeSer.marginTsoOrder : TradeSer.tsoOrder;
        } else if (isStop) {
          // 止损单
          addMarginOrderModeParams();
          serviceFunc = isMargin ? TradeSer.marginStopOrder : TradeSer.makeStopOrder;
        } else if (isTimeWeightedOrder) {
          // 时间加权委托接口
          serviceFunc = TradeSer.timeWeightedOrderTrade;
        } else if (!isMargin) {
          // 现货限/市价单
          serviceFunc = TradeSer.order;
        } else if (
          // 非止损自动借币/自动借还单
          isOpenAutoBorrow ||
          tradeFormState[borrowTypeKey] === 'auto'
        ) {
          addMarginOrderModeParams(['autoRepay']);
          serviceFunc = TradeSer.marginTrade;
        } else {
          // 自动还币单 和 普通单
          serviceFunc = TradeSer.newMarginTrade;
          // 自动还币单，新老版本都需要添加标识
          if (isOpenAutoRepay || tradeFormState.isOldAutoReay) {
            opts.autoRepay = true;
          }
        }
        sentryParams.serviceFunc = _.toString(serviceFunc);
        result = yield call(serviceFunc, opts);

        // 下单后更新 展示满意度调研弹窗下单标记
        yield put({
          type: 'portal/markSatisfiedSurveyPlaceOrderCondition',
        });
      } catch (e) {
        const { code: tradeTypeCode = '' } = TRADE_TYPES_CONFIG[tradeType] || {};
        // 添加一条面包屑，随report记录一起上报sentry平台
        if (window.SentryLazy?.addBreadcrumb) {
          window.SentryLazy.addBreadcrumb({
            type: 'info',
            level: 'fatal',
            category: 'message',
            message: JSON.stringify(sentryParams),
          });
        }
        try {
          sentry.captureEvent({
            level: 'fatal',
            message: `${tradeTypeCode}TradeResults-failed: ${e?.msg || '-'}`,
            tags: {
              fatal_type: 'tradeResultsReport',
            },
          });
        } catch (err) {
          console.error(err);
        }
        result = e;
      } finally {
        // console.log('submiting', opts);
        yield put({
          type: 'update',
          payload: {
            [`${LoadingKey}${side}`]: false,
          },
        });
      }
      return result;
    },
    // 获取用户在当前交易对的手续费（包含用户等级的基础费率）
    // 没有记录就请求记录，
    *getSymbolFee({ payload }, { call, put, select }) {
      const { feeInfoMap = {} } = yield select((state) => state.tradeForm);
      const { currentSymbol } = payload;

      if (feeInfoMap[currentSymbol] || !currentSymbol) {
        return;
      }

      yield yield put({
        type: 'pullFeeBySymbol',
        payload: {
          symbol: currentSymbol,
        },
      });
      yield call(sleep, 2000);
      yield put({
        type: 'getSymbolFee',
        payload: {
          currentSymbol,
        },
      });
      // yield call();
    },

    // 更新高级模式数据
    *updateAdvanceModalData({ payload = {} }, { put }) {
      const { side, settings } = payload;
      yield put({
        type: 'update',
        payload: {
          [`advanceSettings_${side}`]: settings,
        },
      });
    },

    // 根据交易对获取手续费
    *pullFeeBySymbol({ payload: { symbol } }, { call, put }) {
      const { data } = yield call(getFeeBySymbol, symbol);
      data.createdAt = new Date();
      yield put({
        type: 'updateFeeInfo',
        payload: { feeInfo: { symbol, data } },
      });
    },

    // 检查是否支持做杠杆交易
    *checkCoinPairIsSupportMargin({ payload }, { select }) {
      const { symbol } = payload;
      const { symbolsMap } = yield select((state) => state.symbols);
      return symbolsMap[symbol] ? symbolsMap[symbol].isMarginEnabled || false : false;
    },
    *queryMaintenanceStatus({ payload }, { put, call, select }) {
      let maintenanceData = null;
      try {
        const { data } = yield call(TradeSer.getMaintenanceStatus, payload);
        if (data && data.maintenance !== undefined) maintenanceData = data;
      } catch (e) {
        try {
          // 尝试请求静态json, 有可能404
          const { data: rollBackData } = yield call(TradeSer.getMaintenanceStatusFailBack, payload);
          // 转换json文件相关字段，与getMaintenanceStatus的返回数据结构保持一致
          if (rollBackData && rollBackData.maintenance !== undefined) {
            const currentLang = yield select((state) => state.app.currentLang);
            maintenanceData = convertMaintenanceJSON(rollBackData, currentLang);
            // 计算有效性
            yield call(delay, 2000);
            const { serverTime, requestedLocalTime } = yield select((state) => state.server_time);
            const currentTime = getCurrentTime({
              serverTime,
              requestedLocalTime,
            });
            const { startAt, endAt } = maintenanceData;
            const expired = isOutOfTimeRange(currentTime, [startAt, endAt]);
            if (expired) maintenanceData = {};
          }
        } catch (jsonError) {
          console.error('getMaintenanceStatusFailBack', jsonError);
        }
      }
      if (maintenanceData) {
        if (typeof maintenanceData.maintenanceV2 === 'boolean') {
          maintenanceData.maintenance = maintenanceData.maintenanceV2;
        }
        yield put({
          type: 'update',
          payload: {
            maintenanceStatus: maintenanceData,
          },
        });
      }
    },
    // 根据交易对获取手续费
    *getTimeWeightedOrderConfig(payload, { call, put }) {
      const { data } = yield call(TradeSer.getTimeWeightedOrderConfig);
      yield put({
        type: 'update',
        payload: { timeWeightedOrderConfig: { ...data } },
      });
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({ type: 'init' });
      // 获取系统维护的状态
      dispatch({ type: 'queryMaintenanceStatus' });
    },
  },
});
