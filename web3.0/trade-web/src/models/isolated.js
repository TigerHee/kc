/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2021-04-30 16:21:18
 * @Description:逐仓相关
 */
import { eachRight, each, isEqual, pick } from 'lodash';
import extend from 'dva-model-extend';
import * as ws from '@kc/socket';
import baseUtil from 'common/models/base';
import polling from 'common/models/polling';
import * as serv from 'services/isolated';
import workerSocket from 'common/utils/socketProcess';
import {
  getEarning,
  getEarningRate,
  getLiabilities,
  getNetAsset,
  getLiquidationPrice,
  getTargetPriceSymbolsStr,
  currencyAmount2BtcAmount,
  btcAmount2CurrencyAmount,
  getRealLeaverage,
  getMaxBorrowSize,
  getAvailableBalance,
} from 'components/Isolated/utils';
import { STATUS, ACCOUNT_CODE } from 'components/KcTransferModal/config';
import { add, multiply } from 'helper';
import { APMSWCONSTANTS } from 'utils/apm/apmConstants';

const ISOLATED_STATUS = STATUS[ACCOUNT_CODE.ISOLATED];
// 信息是否正常
const checkIsHideInfo = (status, key) => {
  return ISOLATED_STATUS[status] && ISOLATED_STATUS[status][key];
};

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

export default extend(baseUtil, polling, {
  namespace: 'isolated',
  state: {
    activeSymbol: '', // 用来判断仓位rest轮训拉取是否跳过推送已连接的阻断
    changePosition: null,
    positionMap: {},
    tagMap: {},
    targetPriceMap: {
      'BTC-BTC': 1,
    },
    leverageVisible: false, // 设置杠杆倍数弹窗控制显隐
    borrowSizeMap: {},
    assetsList: [],
  },
  reducers: {
    updateTargetPrice(state, { payload }) {
      return {
        ...state,
        targetPriceMap: { ...state.targetPriceMap, ...payload },
      };
    },
    updatePositionMap(state, { payload }) {
      return {
        ...state,
        positionMap: { ...state.positionMap, ...payload },
      };
    },
    updateTagMap(state, { payload }) {
      const { status, isAutoRepay, tag } = payload;
      return {
        ...state,
        tagMap: {
          ...state.tagMap,
          [tag]: {
            ...(state.tagMap[tag] || {}),
            ...(status !== undefined ? { status } : {}),
            ...(isAutoRepay !== undefined ? { isAutoRepay } : {}),
          },
        },
      };
    },
    changeUserLeverage(state, { payload }) {
      const { userLeverage, currentSymbol } = payload;
      return {
        ...state,
        positionMap: {
          ...state.positionMap,
          [currentSymbol]: {
            ...(state.positionMap[currentSymbol] || {}),
            userLeverage,
          },
        },
      };
    },
  },
  effects: {
    *pullIsolatedAppoint({ forceFetch = false }, { call, put, select }) {
      const { currentSymbol } = yield select((state) => state.trade);
      const { marginSymbolsMap } = yield select((state) => state.symbols);
      const { activeSymbol, positionMap } = yield select(
        (state) => state.isolated,
      );

      const { isIsolatedEnabled } = marginSymbolsMap[currentSymbol] || {};
      if (!isIsolatedEnabled) return;
      // sokect正常连接并且topic_state为1时，阻止此次fetch
      const connected = yield workerSocket.connected();
      if (
        connected &&
        !forceFetch &&
        positionMap[currentSymbol] &&
        activeSymbol === currentSymbol
      ) {
        const topic = ws.Topic.get('/margin/isolatedPosition:{SYMBOL_LIST}', {
          SYMBOLS: [currentSymbol],
        });
        const wsState = yield workerSocket.getTopicState();
        if (wsState) {
          const { topicStateConst, topicState } = wsState;
          const topicStateData = topicStateConst.SUBSCRIBED;
          if (
            topicState[topic] &&
            topicState[topic].status === topicStateData
          ) {
            return;
          }
        }
      }
      const { data } = yield call(serv.getIsolatedAppoint, {
        tag: currentSymbol,
      });
      yield put({
        type: 'update',
        payload: { activeSymbol: currentSymbol },
      });
      yield put({
        type: 'updatePosition',
        payload: data,
      });
    },
    // 获取用户标记价格
    *pullTargetPrice({ payload = {} }, { put, call, select }) {
      const { currentSymbol } = yield select((state) => state.trade);
      const [base, quote] = currentSymbol.split('-');
      const symbolsStr = getTargetPriceSymbolsStr([base, quote]);
      // sokect正常连接并且topic_state为1时，阻止此次fetch
      const connected = yield workerSocket.connected();
      if (connected) {
        const topic = ws.Topic.get('/indicator/markPrice:{SYMBOL_LIST}', {
          SYMBOLS: [symbolsStr],
        });
        const wsState = yield workerSocket.getTopicState();
        if (wsState) {
          const { topicStateConst, topicState } = wsState;
          const topicStateData = topicStateConst.SUBSCRIBED;
          if (
            topicState[topic] &&
            topicState[topic].status === topicStateData
          ) {
            return;
          }
        }
      }
      const { success, data } = yield call(serv.getTargetPrice);
      if (success) {
        const targetPriceMap = {};
        each(data, (item) => {
          targetPriceMap[item.symbol] = item.value;
        });
        yield put({
          type: 'updateTargetPrice',
          payload: targetPriceMap,
        });
      }
    },
    *updateUserLeverage({ payload = {} }, { call }) {
      const res = yield call(serv.setUserLeverage, payload);
      return res;
    },
    *pullPositionStatusByTag({ payload = {} }, { call, put, select }) {
      const { tag } = payload;
      const { currentSymbol } = yield select((state) => state.trade);
      if (tag === currentSymbol) return;
      // 后端Ethan确认，查状态就用根据交易对查仓位的接口
      const { data } = yield call(serv.getIsolatedAppoint, payload);
      yield put({
        type: 'updateTagMap',
        payload: {
          tag,
          status: data.status,
          isAutoRepay: data.isAutoRepay,
        },
      });
    },
    *updateAutoRepay({ payload = {}, callback }, { call, put }) {
      const { symbol, switchStatus } = payload;
      const { success } = yield call(serv.updateAutoRepay, {
        symbol,
        isEnabled: switchStatus,
      });
      if (success) {
        yield put({
          type: 'updateTagMap',
          payload: {
            tag: symbol,
            isAutoRepay: switchStatus,
          },
        });
        if (typeof callback === 'function') callback();
      }
    },
    *updatePosition({ payload }, { put, select }) {
      const categories = yield select((state) => state.categories);
      const { currentSymbol } = yield select((state) => state.trade);
      const { symbolsMap, isolatedSymbolsMap } = yield select(
        (state) => state.symbols,
      );
      const { tagMap, positionMap, targetPriceMap } = yield select(
        (state) => state.isolated,
      );

      const currentTagConfig = tagMap[currentSymbol] || {};
      const { pricePrecision = 8 } = symbolsMap[currentSymbol] || {};
      const currentPosition = positionMap[currentSymbol] || {};
      const {
        baseAsset = null,
        quoteAsset = null,
        tag = currentSymbol,
        totalConversionBalance,
        status = currentPosition.status,
        isAutoRepay = currentTagConfig.isAutoRepay,
        accumulatedPrincipal = currentPosition.accumulatedPrincipal,
        ...other
      } = payload || {};

      const [base, quote] = tag.split('-');
      // currency存在，说明是接口拉取的数据，因为仓位数据不含此字段， 接口拉取的数据直接更新
      const isChangeBaseAsset =
        baseAsset &&
        (baseAsset.currency ||
          !isEqual(
            baseAsset,
            pick(currentPosition[base], [
              'holdBalance',
              'liabilityInterest',
              'liabilityPrincipal',
              'totalBalance',
            ]),
          ));
      const isChangeQuoteAsset =
        quoteAsset &&
        (quoteAsset.currency ||
          !isEqual(
            quoteAsset,
            pick(currentPosition[quote], [
              'holdBalance',
              'liabilityInterest',
              'liabilityPrincipal',
              'totalBalance',
            ]),
          ));
      // base或者quote的仓位是否存在变化
      const isChange = [isChangeBaseAsset, isChangeQuoteAsset].some((v) => v);

      const {
        [base]: currentBaseAsset = null,
        [quote]: currentQuoteAsset = null,
        liquidationPrice: oldLiquidationPrice = 0,
      } = currentPosition;
      const mergeBaseAsset = { ...currentBaseAsset, ...baseAsset };
      const mergeQuoteAsset = { ...currentQuoteAsset, ...quoteAsset };
      if ([mergeBaseAsset, mergeQuoteAsset].some((v) => !v.currency)) return;
      const { flDebtRatio = 0 } = isolatedSymbolsMap[tag] || {};
      const {
        liability: baseLiability,
        markPrice: baseMarkPrice,
        availableBalance: oldBaseAvailableBalance,
        totalBalance: baseTotalBalance,
        holdBalance: baseHoldBalance,
        liabilityInterest: baseLiabilityInterest,
        liabilityPrincipal: baseLiabilityPrincipal,
        marginCoefficient: baseMarginCoefficient = 1,
      } = mergeBaseAsset;
      const {
        liability: quoteLiability,
        markPrice: quoteMarkPrice,
        availableBalance: oldQuoteAvailableBalance,
        totalBalance: quoteTotalBalance,
        holdBalance: quoteHoldBalance,
        liabilityInterest: quoteLiabilityInterest,
        liabilityPrincipal: quoteLiabilityPrincipal,
        marginCoefficient: quoteMarginCoefficient = 1,
      } = mergeQuoteAsset;

      const baseTargetPrice =
        targetPriceMap[`${base}-BTC`] || baseMarkPrice || 0;
      const quoteTargetPrice =
        targetPriceMap[`${quote}-BTC`] || quoteMarkPrice || 0;
      const { precision: basePrecision } = categories[base] || { precision: 8 };
      const { precision: quotePrecision } = categories[quote] || {
        precision: 8,
      };

      const baseTotalLiability = isChangeBaseAsset
        ? add(baseLiabilityInterest, baseLiabilityPrincipal).toFixed()
        : baseLiability;
      const quoteTotalLiability = isChangeQuoteAsset
        ? add(quoteLiabilityInterest, quoteLiabilityPrincipal).toFixed()
        : quoteLiability;
      const baseAvailableBalance = isChangeBaseAsset
        ? getAvailableBalance(baseTotalBalance, baseHoldBalance, basePrecision)
        : oldBaseAvailableBalance;
      const quoteAvailableBalance = isChangeQuoteAsset
        ? getAvailableBalance(
            quoteTotalBalance,
            quoteHoldBalance,
            quotePrecision,
          )
        : oldQuoteAvailableBalance;

      const baseRest = [baseTargetPrice, base];
      // 涉及到标记价格的计算，即使传过来的asset为空，也保持计算
      const baseTotalBalanceToQuote = btcAmount2CurrencyAmount(
        currencyAmount2BtcAmount(baseTotalBalance, ...baseRest),
        quoteTargetPrice,
      );
      const baseLiabilityToQuote = btcAmount2CurrencyAmount(
        currencyAmount2BtcAmount(baseTotalLiability, ...baseRest),
        quoteTargetPrice,
      );
      // 账户总资产（单位：quote）
      const totalBalance = add(
        baseTotalBalanceToQuote,
        quoteTotalBalance,
      ).toFixed();
      // 带入了保证金系数的账户总资产（单位：quote）
      const totalBalanceWithCoefficient = add(
        multiply(baseTotalBalanceToQuote, baseMarginCoefficient),
        multiply(quoteTotalBalance, quoteMarginCoefficient),
      ).toFixed();
      const _totalConversionBalance =
        totalConversionBalance !== undefined
          ? totalConversionBalance
          : currencyAmount2BtcAmount(totalBalance, quoteTargetPrice, quote);
      // 账户总负债（单位：quote）
      const totalLiability = add(
        baseLiabilityToQuote,
        quoteTotalLiability,
      ).toFixed();
      const totalConversionLiability = currencyAmount2BtcAmount(
        totalLiability,
        quoteTargetPrice,
        quote,
      );

      const nextBaseAsset = {
        ...mergeBaseAsset,
        currency: base,
        precision: basePrecision,
        markPrice: baseTargetPrice,
        liability: baseTotalLiability,
        availableBalance: baseAvailableBalance,
      };
      const nextQuoteAsset = {
        ...mergeQuoteAsset,
        currency: quote,
        precision: quotePrecision,
        markPrice: quoteTargetPrice, // 标记价格
        liability: quoteTotalLiability,
        availableBalance: quoteAvailableBalance,
      };
      // 净资产
      const netAsset = getNetAsset(totalBalance, totalLiability);
      // 带入了保证金系数的净资产
      const netAssetWithCoefficient = getNetAsset(
        totalBalanceWithCoefficient,
        totalLiability,
      );
      // 盈亏
      const earning = !checkIsHideInfo(status, 'isHideEarningRate')
        ? getEarning(netAsset, accumulatedPrincipal)
        : null;
      // 盈利率
      const earningRate = !checkIsHideInfo(status, 'isHideEarningRate')
        ? getEarningRate(earning, accumulatedPrincipal)
        : null;
      // 负债率
      const liabilityRate = !checkIsHideInfo(status, 'isHideLiabilityRate')
        ? getLiabilities(totalBalanceWithCoefficient, totalLiability)
        : null;
      // 强平价
      let liquidationPrice = null;
      if (!checkIsHideInfo(status, 'isHideLiquidationPrice')) {
        if (isChange) {
          liquidationPrice = getLiquidationPrice(
            nextBaseAsset,
            nextQuoteAsset,
            flDebtRatio,
            pricePrecision,
          );
        } else {
          liquidationPrice = oldLiquidationPrice;
        }
      }

      yield put({
        type: 'updatePositionMap',
        payload: {
          [tag]: {
            ...currentPosition,
            ...other,
            tag,
            status,
            earning,
            netAsset,
            earningRate,
            liabilityRate,
            isAutoRepay,
            totalBalance, // quote币种结算
            totalLiability, // quote币种结算
            liquidationPrice,
            accumulatedPrincipal,
            [base]: nextBaseAsset,
            [quote]: nextQuoteAsset,
            totalConversionLiability,
            netAssetWithCoefficient,
            totalBalanceWithCoefficient,
            totalConversionBalance: _totalConversionBalance,
          },
        },
      });
      if (isChange) {
        const { borrowAmount: baseBorrowAmount } = baseAsset || {};
        const { borrowAmount: quoteBorrowAmount } = quoteAsset || {};
        if (
          [baseBorrowAmount, quoteBorrowAmount].every((v) => v !== undefined)
        ) {
          yield put({
            type: 'update',
            payload: {
              borrowSizeMap: {
                [base]: baseBorrowAmount,
                [quote]: quoteBorrowAmount,
              },
            },
          });
        }
      }
      if (payload) {
        yield put({
          type: 'updateTagMap',
          payload: {
            tag,
            status,
            isAutoRepay,
          },
        });
      }
    },
    *computeMaxBorrowSizeMap({ payload: { userLeverage } }, { put, select }) {
      if (!userLeverage) return {};
      const { currentSymbol } = yield select((state) => state.trade);
      const { positionMap, targetPriceMap } = yield select(
        (state) => state.isolated,
      );
      const { loanCurrenciesMap } = yield select((state) => state.marginMeta);
      const { isolatedSymbolsMap } = yield select((state) => state.symbols);
      const currentSymbolConfig = isolatedSymbolsMap[currentSymbol];
      const [base, quote] = currentSymbol.split('-');

      if (!positionMap[currentSymbol] || !currentSymbolConfig) return {};

      const {
        totalLiability,
        netAssetWithCoefficient,
        totalBalanceWithCoefficient,
      } = positionMap[currentSymbol];
      // 总资产为0，直接重置borrowSizeMap里币种的值为0
      if (!+totalBalanceWithCoefficient) {
        yield put({
          type: 'update',
          payload: {
            borrowSizeMap: {
              [base]: 0,
              [quote]: 0,
            },
          },
        });
        return {};
      }
      const nextBorrowSizeMap = {};
      [base, quote].forEach((currency) => {
        const { borrowMinAmount, currencyLoanMinUnit } =
          loanCurrenciesMap[currency] || {};
        const keyStr = currency === base ? 'base' : 'quote';
        const isDebitEnabled = currentSymbolConfig[`${keyStr}BorrowEnable`];
        const borrowMaxAmount = currentSymbolConfig[`${keyStr}MaxBorrowAmount`];
        const borrowCoefficient =
          currentSymbolConfig[`${keyStr}BorrowCoefficient`];
        if (!isDebitEnabled) {
          nextBorrowSizeMap[currency] = 0;
          return;
        }
        const { [currency]: coinDetail } = positionMap[currentSymbol] || {};
        const { liability } = coinDetail || {};
        const targetPrice = targetPriceMap[`${currency}-BTC`] || 0;
        const quoteTargetPrice = targetPriceMap[`${quote}-BTC`] || 0;
        const isQuote = currency === quote;
        nextBorrowSizeMap[currency] = getMaxBorrowSize({
          coin: {
            liability,
            targetPrice,
            borrowMaxAmount,
            borrowMinAmount,
            borrowCoefficient,
            currencyLoanMinUnit,
          },
          userLeverage,
          quoteIsSelf: isQuote,
          netAsset: !isQuote
            ? currencyAmount2BtcAmount(
                netAssetWithCoefficient,
                quoteTargetPrice,
                quote,
              )
            : netAssetWithCoefficient,
          totalLiability: !isQuote
            ? currencyAmount2BtcAmount(totalLiability, quoteTargetPrice, quote)
            : totalLiability,
        });
      });
      return nextBorrowSizeMap;
    },
    *getMaxBorrowSizeMap(_, { put, select }) {
      const { positionMap } = yield select((state) => state.isolated);
      const { currentSymbol } = yield select((state) => state.trade);
      const { userLeverage } = positionMap[currentSymbol] || {};
      const nextBorrowSizeMap = yield yield put({
        type: 'computeMaxBorrowSizeMap',
        payload: { userLeverage },
      });
      yield put({
        type: 'update',
        payload: {
          borrowSizeMap: nextBorrowSizeMap || {},
        },
      });
    },
    *getCurrentRealLeverage(_, { select }) {
      const { currentSymbol } = yield select((state) => state.trade);
      const { positionMap } = yield select((state) => state.isolated);
      const {
        totalLiability,
        netAssetWithCoefficient,
        totalBalanceWithCoefficient,
      } = positionMap[currentSymbol] || {};
      if (!totalLiability || !+totalLiability) return 1;
      return getRealLeaverage(
        totalBalanceWithCoefficient,
        netAssetWithCoefficient,
      );
    },
    *postBorrow({ payload = {} }, { call }) {
      const res = yield call(serv.postBorrow, payload);
      return res;
    },
    *postRepay({ payload = {} }, { call }) {
      const res = yield call(serv.postRepay, payload);
      return res;
    },
    *updateChangePosition({ payload = {} }, { put, select }) {
      const { changePosition } = yield select((state) => state.isolated);
      if (changePosition && payload.timestamp <= changePosition.timestamp) {
        return;
      }
      yield put({
        type: 'update',
        payload: {
          changePosition: payload,
        },
      });
    },
    *pullAssetsList({ payload = {} }, { call, put }) {
      const { data } = yield call(serv.getIsolatedAssetsList, payload);
      yield put({
        type: 'update',
        payload: {
          assetsList: data,
        },
      });
    },
    *registerPullAssetsListPolling(__, { put }) {
      yield put({
        type: 'watchPolling',
        payload: { effect: 'pullAssetsList', interval: 60 * 1000 },
      });
    },
    *sendSwSensor(__, { put, select }) {
      try {
        const { swFrequency } = yield select(
          (state) => state.collectionSensorsStore,
        );
        if (!swFrequency[APMSWCONSTANTS.TICK]) {
          swFrequency[APMSWCONSTANTS.TICK] = {
            mount_trade: 0,
            event_name: APMSWCONSTANTS.TRADE_FLUSH_ANALYSE,
            component: APMSWCONSTANTS.TICK,
          };
        }
        swFrequency[APMSWCONSTANTS.TICK].mount_trade += 1;
        yield put({
          type: 'collectionSensorsStore/collectSwFrequency',
          payload: swFrequency,
        });
      } catch (error) {
        console.error('sendSwSensor-error', error);
      }
    },
  },
  subscriptions: {
    watchPolling({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullTargetPrice',
        },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullIsolatedAppoint',
        },
      });
    },
    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      workerSocket.positionChangeMessage((arr) => {
        const arrLen = arr.length;
        window._x_topicTj('/margin/isolatedPosition', 'positionChange', arrLen);
        const { changeAssets, tag, ...other } = arr[arrLen - 1].data;
        const [base, quote] = tag.split('-');
        const baseAssets = changeAssets[base];
        const quoteAssets = changeAssets[quote];

        const changePosition = {
          tag,
          ...other,
          baseAsset: baseAssets
            ? {
                holdBalance: baseAssets.hold,
                totalBalance: baseAssets.total,
                liabilityInterest: baseAssets.liabilityInterest,
                liabilityPrincipal: baseAssets.liabilityPrincipal,
              }
            : null,
          quoteAsset: quoteAssets
            ? {
                holdBalance: quoteAssets.hold,
                totalBalance: quoteAssets.total,
                liabilityInterest: quoteAssets.liabilityInterest,
                liabilityPrincipal: quoteAssets.liabilityPrincipal,
              }
            : null,
        };
        dispatch({
          type: 'updateChangePosition',
          payload: changePosition,
        });
      });
      workerSocket.markPriceTickMessage((arr) => {
        window._x_topicTj('/indicator/markPrice', 'tick', arr.length);
        const diffMap = {};
        // 后来的先覆盖
        eachRight(arr, (_message) => {
          const { data = {} } = _message;
          const { symbol, value } = data;
          if (diffMap[symbol] === undefined) {
            diffMap[symbol] = value;
          }
        });
        /** update */
        dispatch({ type: 'updateTargetPrice', payload: diffMap });
        /** 粗略认为update时为render结束时进行计数*/
        dispatch({ type: 'sendSwSensor' });
      });
    },
  },
});
