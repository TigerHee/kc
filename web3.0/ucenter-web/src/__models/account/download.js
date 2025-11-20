/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import filter from 'common/models/filter';
import pagination from 'common/models/paginate';
import polling from 'common/models/polling';
import extend from 'dva-model-extend';
import * as serv from 'services/download';

export default extend(base, pagination, filter, polling, {
  namespace: 'download',
  state: {
    records: [],
    filters: {
      page: 1,
      size: 10,
    },
    ready: false,
  },
  reducers: {},
  effects: {
    *query({ payload: { current = 1, pageSize = 10 } }, { put, call }) {
      const { items, currentPage, totalNum, ...rest } = yield call(serv.getRecordsV2, {
        page: current,
        size: pageSize,
      });
      yield put({
        type: 'savePage',
        payload: {
          items: items ? [...items] : [],
          currentPage,
          pageSize: rest.pageSize,
          totalNum,
        },
      });
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'query', interval: 60 * 1000 },
      });
    },
  },
});
