/**
 * Owner: solar.xia@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { getOfflineNotices } from 'services/currencyOfflineAnnouncement';

const initialPagination = {
  current: 1,
  pageSize: 30,
};
export default extend(base, {
  namespace: 'currency_offline',
  state: {
    records: [],
    pagination: { ...initialPagination, totalNum: 0 },
  },
  reducers: {},
  effects: {
    *pullOfflineNotices({ payload = { currencyName: '' } }, { call, put }) {
      if (payload.currencyName.length >= 10) {
        yield put({
          type: 'update',
          payload: {
            records: [],
            pagination: {
              ...initialPagination,
              totalNum: 0,
            },
          },
        });
        return;
      }
      const {
        items,
        currentPage,
        totalNum = 0,
        pageSize,
      } = yield call(getOfflineNotices, {
        currentPage: initialPagination.current,
        pageSize: initialPagination.pageSize,
        ...payload,
      });
      yield put({
        type: 'update',
        payload: {
          records: items,
          pagination: {
            current: currentPage,
            pageSize,
            total: totalNum,
          },
        },
      });
    },
  },
  subscriptions: {},
});
