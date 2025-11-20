/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import {baseModel} from 'utils/dva';
import {
  queryMarketOrders,
  queryLimitOrders,
  queryConvertOrderDetail,
} from 'services/order';
import moment from 'moment';
export default extend(baseModel, {
  namespace: 'order',
  state: {
    historyOrderType: 'MARKET', // 历史订单类型 MARKET ｜ LIMIT
    filters: {
      status: 'ALL',
      fromCurrency: '',
      toCurrency: '',
      startTime: moment().subtract(1, 'month').format('x') * 1,
      endTime: moment().endOf('day').format('x') * 1,
    },
    timeFilters: '1month',

    detail: {},
    orderCoinList: [],
    limitOrderCoinList: [],

    list: [],
    pageIndex: 1,
    totalPage: 1,
    marketFirstPageLoading: false,

    LimitList: [],
    LimitPageIndex: 1,
    LimitTotalPage: 1,
    LimitFirstPageLoading: false,

    currentList: [],
    currentPageIndex: 1,
    currentTotalPage: 1,
    currentFirstPageLoading: false,
  },
  effects: {
    *reset({payload = {}}, {put}) {
      let _payload = {
        filters: {
          status: 'ALL',
          fromCurrency: '',
          toCurrency: '',
          startTime: moment().subtract(1, 'month').format('x') * 1,
          endTime: moment().endOf('day').format('x') * 1,
        },
        timeFilters: '1month',
      };
      if (payload?.clearList) {
        _payload = {..._payload, pageIndex: 1, totalPage: 1};
      }
      yield put({
        type: 'update',
        payload: _payload,
      });
    },
    *queryMarketOrders({payload}, {select, call, put}) {
      const {filters, list} = yield select(state => state.order);
      const params = {
        pageIndex: payload.pageIndex,
        pageSize: 30,
      };
      for (const key in filters) {
        if (filters[key] && filters[key] !== 'ALL') {
          params[key] = filters[key];
        }
      }
      if (payload.pageIndex === 1) {
        yield put({
          type: 'update',
          payload: {
            marketFirstPageLoading: true,
          },
        });
      }
      const {success, items, totalPage} = yield call(queryMarketOrders, params);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            list: payload.pageIndex === 1 ? [...items] : [...list, ...items],
            pageIndex: payload.pageIndex,
            totalPage: totalPage,
            marketFirstPageLoading: false,
          },
        });
      } else {
        yield put({
          type: 'update',
          payload: {
            marketFirstPageLoading: false,
          },
        });
      }
    },

    *queryLimitOrders({payload}, {select, call, put}) {
      const {filters, LimitList} = yield select(state => state.order);
      const params = {
        pageIndex: payload.pageIndex,
        pageSize: 30,
      };
      for (const key in filters) {
        if (filters[key] && filters[key] !== 'ALL') {
          params[key] = filters[key];
        }
      }
      // 需要特殊处理给后端的参数，去除 ACTIVE
      params.statuses =
        filters.status === 'ALL'
          ? ['SUCCESS', 'FAIL', 'CANCEL']
          : [filters.status];

      params.status = undefined;

      if (payload.pageIndex === 1) {
        yield put({
          type: 'update',
          payload: {
            LimitFirstPageLoading: true,
          },
        });
      }
      const {success, items, totalPage} = yield call(queryLimitOrders, params);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            LimitList:
              payload.pageIndex === 1 ? [...items] : [...LimitList, ...items],
            LimitPageIndex: payload.pageIndex,
            LimitTotalPage: totalPage,
            LimitFirstPageLoading: false,
          },
        });
      } else {
        yield put({
          type: 'update',
          payload: {
            LimitFirstPageLoading: false,
          },
        });
      }
    },

    *queryConvertOrderDetail({payload}, {call, put}) {
      const {success, data} = yield call(queryConvertOrderDetail, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            detail: data,
          },
        });
      }
    },

    *queryCurrentOrders({payload}, {select, call, put}) {
      const {currentList} = yield select(state => state.order);
      const params = {
        pageIndex: payload.pageIndex,
        pageSize: 30,
        statuses: ['ACTIVE'],
      };

      if (payload.pageIndex === 1) {
        yield put({
          type: 'update',
          payload: {
            currentFirstPageLoading: true,
          },
        });
      }

      const {success, items, totalPage} = yield call(queryLimitOrders, params);

      const list =
        payload.pageIndex === 1 ? [...items] : [...currentList, ...items];

      if (success) {
        yield put({
          type: 'update',
          payload: {
            currentList: list,
            currentPageIndex: payload.pageIndex,
            currentTotalPage: totalPage,
            currentFirstPageLoading: false,
          },
        });
      } else {
        yield put({
          type: 'update',
          payload: {
            currentFirstPageLoading: false,
          },
        });
      }
    },
  },
});
