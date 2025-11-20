/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Jessie
 * @Date: 2019-08-12 14:30:04
 * @Description: ''
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import filter from 'common/models/filter';
import clearRecords from './common/clearRecords';
import { queryDealOrders } from 'services/order';
import { FUTURES } from '@/meta/const';
import moment from 'moment';

export default extend(base, polling, filter, clearRecords, {
  namespace: 'orderDealDetail',
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
        ...state.orderDealDetail,
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
      const params = {
        currentPage: 1,
        pageSize: 30,
        symbol,
        side: filters.side || undefined,
        type: filters.type || undefined,
        start: moment().subtract(3, 'months').valueOf(), // 三个月
        end: moment().valueOf(),
      };
      params.tradeType = tradeType;
      const ret = yield call(queryDealOrders, params);
      const { success } = ret;
      if (success) {
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
