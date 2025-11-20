/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Jessie
 * @Date: 2019-08-12 14:30:04
 * @Description: ''
 */
import { _t } from 'utils/lang';
import { track } from 'utils/ga';
import { TRADE_TYPES_CONFIG } from 'utils/hooks/useTradeTypes';
import { includes } from 'lodash';
import sentry from '@kc/sentry';
import { APMCONSTANTS } from 'utils/apm/apmConstants';
import { getCancelAllApi, getCancelSpecifyOrderApi } from './utils';

const types = [
  {
    text: () => _t('orders.type.all'),
    value: '',
  },
  {
    text: () => _t('orders.type.limit'),
    value: 'limit',
  },
  {
    text: () => _t('orders.type.market'),
    value: 'market',
  },
  {
    text: () => _t('orders.type.market.stop'),
    value: 'market_stop',
  },
  {
    text: () => _t('orders.type.limit.stop'),
    value: 'limit_stop',
  },
  {
    text: () => _t('orders.type.limit.oco'),
    value: 'limit_oco',
  },
  {
    text: () => _t('trd.form.tso.title'),
    value: 'limit_tso', // 跟踪委托
  },
  {
    text: () => _t('trd.form.tso.title'),
    value: 'tso', // 跟踪委托
  },
];

const getCancelSpecifyOrderDesc = ({ type, side, symbolName, namespace }) => {
  if (namespace !== 'orderTwap') {
    return `${types.find((v) => v.value === type).text()} ${_t(
      `orders.desc.${side}`,
    )} ${symbolName}`;
  }
  return `${_t('9vZMJ91Rea72iuDjqm7zrD')} ${_t(`orders.desc.${side}`)} ${symbolName}`;
};

export default {
  effects: {
    *reportSensorForCancelOrder(
      { payload: { endApiTime, startApiTime, success, symbolStr, tradeType, cancelAll } },
      { select },
    ) {
      /**
       * add sendSensorApm for cancelOrder by owen
       * params:
       */
      try {
        const { sensorsInstance } = yield select((state) => state.collectionSensorsStore);
        const apiDiffTime = Number(endApiTime - startApiTime);
        const basePayload = {
          network_path: '',
          is_success: success,
          fail_reason: '',
          api_duration_order: apiDiffTime,
        };
        const others = {
          trade_pair: symbolStr || '',
          trade_currency: '',
          trade_type: '',
          pricing_type: '',
          leverage_multiplier: '',
          trade_service_type: tradeType || '',
          cancel_all: cancelAll,
        };
        if (sensorsInstance[APMCONSTANTS.TRADE_ORDER_CANCEL_ANALYSE]) {
          sensorsInstance[APMCONSTANTS.TRADE_ORDER_CANCEL_ANALYSE].sendSensorApm(
            basePayload,
            others,
          );
        }
      } catch (e) {
        console.error(e, 'sensorsAPMReportError');
      }
    },
    *cancelAllOrders({ type }, { call, put, select }) {
      const namespace = type.split('/')[0];
      const {
        order: {
          filters: { symbol, type: orderType, side },
          totalNum,
        },
        trade: { currentSymbol },
      } = yield select((state) => ({ order: state[namespace], trade: state.trade }));
      const { tradeType } = yield select((state) => {
        return {
          tradeType: state.trade.tradeType,
        };
      });

      let symbolStr;
      if (symbol === 'current') {
        symbolStr = currentSymbol;
      }
      const isStop = namespace !== 'orderCurrent';
      const isOCO = includes(orderType, 'oco');
      const isTSO = includes(orderType, 'tso');

      const params = {
        tradeType,
        symbol: symbolStr,
        side: side || undefined,
        type: orderType || undefined,
      };
      if (isStop && orderType) {
        // 高级委托 取消全部 新增stop参数 stop
        params.stop = 'stop';
      }
      if (isOCO && isStop) {
        // 高级委托 取消全部 oco stop: oco, type: limit
        params.stop = 'oco';
        params.type = 'limit';
      } else if (isTSO && isStop) {
        params.stop = 'tso';
        params.type = 'limit';
      }
      try {
        // 止盈止损
        const startApiTime = new Date();

        const cancelAllApi = getCancelAllApi({ namespace, tradeType, isStop });

        const { success } = yield call(cancelAllApi, params);

        // const { success } = yield call(cancelAllOrders, params);
        const endApiTime = new Date();
        if (success) {
          yield put({
            type: `${namespace}/query`,
          });
          yield put({
            type: 'notice/feed',
            payload: {
              type: 'notification.success',
              message: _t('trade.allCancelOrders.success'),
              extra: {
                description: _t('trade.cancelOrder.count', {
                  count: totalNum || '0',
                }),
              },
              groupName: 'trade',
            },
          });
        } else {
          yield put({
            type: 'notice/feed',
            payload: {
              type: 'notification.error',
              message: _t('trade.allCancelOrders.failed'),
              extra: {
                description: _t('trade.try.again'),
              },
              groupName: 'trade',
            },
          });
        }
        // 神策埋点
        if (
          TRADE_TYPES_CONFIG[tradeType] &&
          TRADE_TYPES_CONFIG[tradeType].cancelOrderResultEventName
        ) {
          track(TRADE_TYPES_CONFIG[tradeType].cancelOrderResultEventName, {
            is_success: success,
          });
        }
        try {
          yield put({
            type: 'reportSensorForCancelOrder',
            payload: {
              endApiTime,
              startApiTime,
              symbolStr,
              success,
              tradeType,
              cancelAll: true,
            },
          });
        } catch (error) {
          console.error('sendSensor-error', error);
        }
      } catch (e) {
        const { msg } = e || {};
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'notification.error',
            message: _t('trade.allCancelOrders.failed'),
            extra: {
              description: msg || _t('trade.try.again'),
            },
            groupName: 'trade',
          },
        });
        // sentry上报
        // 添加一条面包屑，随report记录一起上报sentry平台
        if (window.SentryLazy?.addBreadcrumb) {
          window.SentryLazy.addBreadcrumb({
            type: 'info',
            level: 'fatal',
            category: 'message',
            message: JSON.stringify(params),
          });
        }
        try {
          sentry.captureEvent({
            level: 'fatal',
            message: `cancelOrders-failed: ${msg || '-'}`,
            tags: {
              fatal_type: 'cancelOrders',
            },
          });
        } catch (err) {
          console.error(err);
        }
        // 神策埋点
        if (
          TRADE_TYPES_CONFIG[tradeType] &&
          TRADE_TYPES_CONFIG[tradeType].cancelOrderResultEventName
        ) {
          track(TRADE_TYPES_CONFIG[tradeType].cancelOrderResultEventName, {
            is_success: false,
          });
        }
      }
    },
    *cancelSpecifyOrder({ type, payload }, { call, put, select }) {
      const { order, isStop } = payload;
      const { id: orderId, side, symbol, type: _type } = order;
      const isOCO = includes(_type, 'oco');
      const isTSO = includes(_type, 'tso');
      // 止损委托列表返回的side是大写的
      const _side = `${side}`.toLowerCase();
      const namespace = type.split('/')[0];
      const categories = yield select((state) => state.categories);
      const { tradeType } = yield select((state) => state.trade);
      const [coin, pair] = symbol.split('-');
      const symbolName = `${categories[coin]?.currencyName}/${categories[pair]?.currencyName}`;
      const description = getCancelSpecifyOrderDesc({
        symbolName,
        namespace,
        side: _side,
        type: _type,
      });
      try {
        const realFn = getCancelSpecifyOrderApi({ namespace, tradeType, isStop, isOCO, isTSO });

        const startApiTime = new Date();
        const { success } = yield call(
          // 新止盈止损
          realFn,
          // cancelOrder,
          orderId,
          // symbol,
        );
        const endApiTime = new Date();
        if (success) {
          yield put({
            type: `${namespace}/query`,
          });
          yield put({
            type: 'notice/feed',
            payload: {
              type: 'notification.success',
              message: _t('trade.cancelOrder.success'),
              extra: {
                description,
              },
              groupName: 'trade',
            },
          });
        } else {
          yield put({
            type: 'notice/feed',
            payload: {
              type: 'notification.error',
              message: _t('trade.cancelOrder.failed'),
              extra: {
                description,
              },
              groupName: 'trade',
            },
          });
        }
        // 神策埋点
        if (
          TRADE_TYPES_CONFIG[tradeType] &&
          TRADE_TYPES_CONFIG[tradeType].cancelOrderResultEventName
        ) {
          track(TRADE_TYPES_CONFIG[tradeType].cancelOrderResultEventName, {
            is_success: success,
          });
        }
        try {
          yield put({
            type: 'reportSensorForCancelOrder',
            payload: {
              endApiTime,
              startApiTime,
              symbolStr: symbolName || '',
              success,
              tradeType,
              cancelAll: false,
            },
          });
        } catch (error) {
          console.error('sendSensor-error', error);
        }
      } catch (e) {
        const { msg } = e || {};
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'notification.error',
            message: msg || _t('trade.cancelOrder.failed'),
            extra: {
              description,
            },
            groupName: 'trade',
          },
        });
        // sentry上报
        // 添加一条面包屑，随report记录一起上报sentry平台
        if (window.SentryLazy?.addBreadcrumb) {
          window.SentryLazy.addBreadcrumb({
            type: 'info',
            level: 'fatal',
            category: 'message',
            message: JSON.stringify({
              orderId,
              tradeType,
            }),
          });
        }
        sentry.captureEvent({
          level: 'fatal',
          message: `cancelOrder-failed: ${msg || '-'}`,
          tags: {
            fatal_type: 'cancelOrder',
          },
        });
        // 神策埋点
        if (
          TRADE_TYPES_CONFIG[tradeType] &&
          TRADE_TYPES_CONFIG[tradeType].cancelOrderResultEventName
        ) {
          track(TRADE_TYPES_CONFIG[tradeType].cancelOrderResultEventName, {
            is_success: false,
          });
        }
      }
    },
  },
};
