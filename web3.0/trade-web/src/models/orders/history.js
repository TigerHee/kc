/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Jessie
 * @Date: 2019-08-12 14:30:04
 * @Description: 历史委托
 */
import extend from 'dva-model-extend';
import { isNil } from 'lodash';
import polling from 'common/models/polling';
import base from 'common/models/base';
import filter from 'common/models/filter';
import detail from './common/detail';
import clearRecords from './common/clearRecords';
import { queryHistoryOrders } from 'services/order';
import { FUTURES } from '@/meta/const';
import { divide } from 'helper';
import moment from 'moment';
import { APMSWCONSTANTS } from 'utils/apm/apmConstants';

export default extend(base, polling, filter, detail, clearRecords, {
  namespace: 'orderHistory',
  state: {
    filters: {},
    num: 0,
    totalNum: 0,
    page: 1,
    records: [],
  },
  effects: {
    *query(_, { select, call, put }) {
      const { filters, page, currentSymbol, isLogin } = yield select((state) => ({
        ...state.orderHistory,
        ...state.trade,
        ...state.user,
      }));
      const { tradeType } = yield select((state) => state.trade);

      if (tradeType === FUTURES) {
        return;
      }

      if (!isLogin) {
        yield put({
          type: 'update',
          payload: {
            records: [],
            num: 0,
            totalNum: 0,
            page: 1,
          },
        });
        return;
      }
      let symbol;
      if (filters.symbol === 'current') {
        symbol = currentSymbol;
      }
      let cancelExist;
      if (filters.cancelExist) {
        cancelExist = filters.cancelExist === 'true';
      }
      const params = {
        currentPage: 1,
        pageSize: 30,
        symbol,
        side: filters.side || undefined,
        type: filters.type || undefined,
        cancelExist,
        start: moment().subtract(3, 'months').valueOf(), // 三个月
        end: moment().valueOf(),
      };
      params.tradeType = tradeType;
      const ret = yield call(queryHistoryOrders, params);
      const { success } = ret;
      if (success) {
        ret.items = (ret.items || []).map((item) => {
          const { dealSize, dealFunds, type } = item;
          return {
            ...item,
            price: type === 'market' ? null : item.price,
            avgPrice: +dealFunds && +dealSize ? divide(dealFunds, dealSize) : 0,
          };
        });
        const maxPage = Math.ceil(ret.items.length / 10) || 1;
        yield put({
          type: 'update',
          payload: {
            records: ret.items,
            num: ret.items.length,
            totalNum: ret.totalNum,
            page: page <= maxPage ? page : maxPage,
          },
        });
        /** 粗略认为update时为历史委托render结束时进行计数*/
        yield put({ type: 'sendSwSensor' });
      }
    },
    *sendSwSensor(__, { put, select }) {
      try {
        const { swFrequency } = yield select((state) => state.collectionSensorsStore);
        if (!swFrequency[APMSWCONSTANTS.HISTORY_ORDER_UPDATE]) {
          swFrequency[APMSWCONSTANTS.HISTORY_ORDER_UPDATE] = {
            mount_trade: 0,
            event_name: APMSWCONSTANTS.TRADE_FLUSH_ANALYSE,
            component: APMSWCONSTANTS.HISTORY_ORDER_UPDATE,
          };
        }
        swFrequency[APMSWCONSTANTS.HISTORY_ORDER_UPDATE].mount_trade += 1;
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
    setPolling({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'filter',
        },
      });
    },
  },
});
