/**
 * Owner: garuda@kupotech.com
 * 该 models 存储下单相关
 */
import base from 'common/models/base';
import orderErrorCatch from 'common/models/futures/orderErrorCatch';
import polling from 'common/models/polling';

import extend from 'dva-model-extend';
import { get } from 'lodash';

import {
  getLiquidationPrice,
  postCreateOrder,
  setUserBasicConfig,
  postCreateTrialFundOrder,
} from '@/services/futures';

import {
  voiceQueue,
  quantityPlaceholder,
  _t,
  evtEmitter,
  storage,
  storagePrefix,
  QUANTITY_UNIT,
  MARGIN_MODE_CROSS,
  TRIAL_FUND_INSUFFICIENT,
  tradeOrderAnalyse,
  INTERFACE_DURATION,
  SENSORS_MARGIN_TYPE,
  MARGIN_MODE_ISOLATED,
  ALL_DURATION,
  trackCustomEvent,
} from './builtinCommon';

import { isOpenFuturesCross } from './builtinHooks';

import {
  LIMIT,
  MARKET,
  STOP,
  STOP_LABEL,
  STOP_LIMIT,
  orderVars,
  TABS_PROFIT,
  BTN_BUY,
  DEFAULT_LEVERAGE,
} from './config';

const initialValue = {
  bid1: 0, // 买一
  ask1: 0, // 卖一
  symbolInfo: {}, // 当前 symbol 的信息
  rangeData: {}, // 只减仓需要使用
  openStash: false, // 是否开启缓存
  calcStashCache: null, // 计算器缓存值
  stashCache: null, // 下单缓存值
  activeTab: LIMIT,
  stopOrderType: STOP_LIMIT, // 条件单选中
  leverage: DEFAULT_LEVERAGE, // 选中的杠杆 默认5倍
  userMaxLeverage: DEFAULT_LEVERAGE, // 用户最大杠杆值 默认5倍
  showLeverageDialog: false, // 杠杆设置弹框
  positionSize: 0, // 仓位数量
  availableBalance: undefined, // 余额
  confirmOrder: true, // 二次确认弹框
  liquidationPrice: 0, // 强平价格
  tradingUnit: QUANTITY_UNIT, // 交易单位
  takerFeeRate: 0.0006, // taker fee
  fixTakerFee: 0, // fix fee
  showLowQuota: false, // 风险限额提示
  chooseUSDsUnit: storage.getItem('chooseUSDsUnit', storagePrefix),
  calculatorBtnType: BTN_BUY,
  calculatorLeverage: DEFAULT_LEVERAGE,
  introduceVisible: false, // 介绍弹框
  introduceKey: 'advancedLimit', // 默认介绍弹框key
  markPrice: 0, // 标记价格
  calcMarginModel: isOpenFuturesCross() ? MARGIN_MODE_CROSS : MARGIN_MODE_ISOLATED,
  calculatorVisible: false,
  calculatorTabsActive: TABS_PROFIT,
};

const eventHandle = evtEmitter.getEvt();

export default extend(base, polling, orderErrorCatch, {
  namespace: 'futuresForm',
  state: initialValue,
  effects: {
    *getLiquidationPrice({ payload: postValues }, { call, put }) {
      try {
        const {
          data: { liquidationPrice },
        } = yield call(getLiquidationPrice, postValues);
        yield put({
          type: 'update',
          payload: {
            liquidationPrice,
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            liquidationPrice: 0,
          },
        });
      }
    },
    *setUserBasicConfig({ payload }, { call, put, select }) {
      const { isLogin } = yield select((state) => state.futuresForm) || {};
      if (payload.tradingUnit) {
        storage.setItem('tradingUnit', payload.tradingUnit, storagePrefix);
        eventHandle.emit('km@setUnit', payload.tradingUnit);
      }
      if (isLogin) {
        yield call(setUserBasicConfig, payload);
      }
      yield put({
        type: 'update',
        payload,
      });
    },
    *create({ payload: { postValues } }, { call, select, put }) {
      let tradeResultStatus = true;
      let tradeResultObj = {};
      const { symbolInfo, currentSymbol: activeSymbol } = yield select(
        (state) => state.futuresForm,
      );
      const { switchTrialFund } = yield select((state) => state.futuresTrialFund) || {};
      const { isQuickOrder, symbol: postSymbol, _type, ...others } = postValues;

      const symbol = postSymbol || activeSymbol;
      try {
        const { price, side, size, type, stop, stopPrice, stopPriceType } = others;

        const createOrderParams = { ...others, symbol };

        tradeResultObj = {
          trade_pair: symbol,
          trade_type: side,
          pricing_type: _type === STOP ? (type === LIMIT ? 'limitStop' : 'limitMarket') : _type,
          trade_service_type: 'Futures',
          leverage_multiplier: others?.leverage,
          is_quickOrder: !!isQuickOrder,
          is_success: true,
          fail_reason: 'none',
          marginType: SENSORS_MARGIN_TYPE[others?.marginMode] || 'isolated',
        };
        tradeOrderAnalyse.addTimer(INTERFACE_DURATION);

        // 如果开上了体验金，则走体验金下单的流程
        if (switchTrialFund) {
          yield call(postCreateTrialFundOrder, createOrderParams);
        } else {
          yield call(postCreateOrder, createOrderParams);
        }

        tradeOrderAnalyse.addTimer(INTERFACE_DURATION, false);
        tradeOrderAnalyse.addTimer(ALL_DURATION, false);
        // 下单时长统计
        tradeOrderAnalyse.sensorsReport(tradeResultObj);
        // 下单结果统计
        trackCustomEvent(
          {
            data: tradeResultObj,
            checkId: false,
          },
          'trade_results',
        );

        // 接入下单结果声音
        voiceQueue.notify('order_success');

        let description;
        if (_type === STOP) {
          if (type === LIMIT) {
            description = `${_t('trade.notice.orderSuccess', {
              price,
              side: _t(orderVars[side]),
              symbol,
              // symbol: SymbolText.symbolToText(contracts[symbol], symbol),
              size,
              tips: quantityPlaceholder(symbolInfo, _t),
            })}, ${_t('trade.notice.stopOrderSuccess', {
              stopType: _t(STOP_LABEL[stopPriceType]),
              stop: orderVars[stop],
              stopPrice,
            })}`;
          }
          if (type === MARKET) {
            description = `${_t('trade.notice.orderSuccess', {
              price: _t('trade.order.market'),
              side: _t(orderVars[side]),
              symbol,
              // symbol: SymbolText.symbolToText(contracts[symbol], symbol),
              size,
              tips: quantityPlaceholder(symbolInfo, _t),
            })}, ${_t('trade.notice.stopOrderSuccess', {
              stopType: _t(STOP_LABEL[stopPriceType]),
              stop: orderVars[stop],
              stopPrice,
            })}`;
          }
        }
        if (_type === LIMIT) {
          description = _t('trade.notice.orderSuccess', {
            price,
            side: _t(orderVars[side]),
            symbol,
            // symbol: SymbolText.symbolToText(contracts[symbol], symbol),
            size,
            tips: quantityPlaceholder(symbolInfo, _t),
          });
        }
        if (_type === MARKET) {
          description = _t('trade.notice.orderSuccess', {
            price: _t('trade.order.market'),
            side: _t(orderVars[side]),
            symbol,
            // symbol: SymbolText.symbolToText(contracts[symbol], symbol),
            size,
            tips: quantityPlaceholder(symbolInfo, _t),
          });
        }
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'notification.success',
            message:
              _type === STOP
                ? `${_t('trade.notice.stopOrderTitle')}:`
                : `${_t('trade.notice.orderTitle')}:`,
            extra: {
              description,
            },
          },
        });

        // 下单后更新 展示满意度调研弹窗下单标记
        yield put({
          type: 'portal/markSatisfiedSurveyPlaceOrderCondition',
        });
      } catch (e) {
        tradeResultStatus = false;
        // 接入下单结果声音
        voiceQueue.notify('order_fail');
        if (e) {
          // Futures 埋点
          const { code, msg, message, response } = e;
          let codeText = code;
          let msgText = msg || message;
          if (!codeText) {
            codeText = get(response, 'code') || get(response, 'data.code');
          }
          if (!msgText) {
            msgText = get(response, 'msg') || get(response, 'data.msg');
          }
          tradeResultObj.is_success = false;
          tradeResultObj.fail_reason = `${codeText || ''}:${msgText || JSON.stringify(e)}`;
          tradeResultObj.fail_reason_code = codeText;
          // 下单时长统计
          tradeOrderAnalyse.sensorsReport(tradeResultObj);
          trackCustomEvent(
            {
              data: tradeResultObj,
              checkId: false,
            },
            'trade_results',
          );

          if (switchTrialFund && e && e.code === TRIAL_FUND_INSUFFICIENT) {
            yield put({
              type: 'futuresTrialFund/update',
              payload: { trialFundInsufficientVisible: true },
            });
            return;
          }
          yield put({
            type: 'orderCatch',
            payload: {
              error: e,
            },
          });
        }
      }

      return tradeResultStatus;
    },
    /**
     * @description 更新风险限额过低提示状态（提示该dialog需要新增条件判断合约字段）
     */
    *updateShowLowQuota({ payload: { dialogState, riskLimitErrorMsg } }, { put, select }) {
      const symbolInfo = yield select((state) => state.futuresForm.symbolInfo);
      const status = symbolInfo.stepRiskLimitStatus;
      // 没有设置阶梯风险限额，弹出提示
      if (!status) {
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'message.error',
            message: riskLimitErrorMsg,
          },
        });
        // 有阶梯风险限额
      } else {
        yield put({
          type: 'update',
          payload: {
            showLowQuota: dialogState,
          },
        });
      }
    },
  },
});
