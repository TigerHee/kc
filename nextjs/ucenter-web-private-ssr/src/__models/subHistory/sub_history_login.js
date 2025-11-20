/**
 * Owner: mcqueen@kupotech.com
 */
import base from 'common/models/base';
import clearRecords from 'common/models/clearRecords';
import pagination from 'common/models/paginate';
import omit from 'common/models/utils/omit';
import extend from 'dva-model-extend';
import moment from 'moment';
import { getSubAccountListWithoutPage, getSubAccountLoginHistory } from 'services/account';

export default extend(base, pagination, clearRecords, {
  namespace: 'sub_history_login',
  state: {
    filters: {},
    subAccountList: [],
  },
  effects: {
    *query(_, { select, call, put }) {
      const { filters } = yield select((state) => state.sub_history_login);
      const _filters = omit(filters);
      const [start, end] = _filters.rangeDate || [];

      const params = {
        subUserId: _filters.subName || undefined,
        start: start && moment(start).valueOf() * 1,
        end: end && moment(end).valueOf() * 1,
        page: _filters.currentPage * 1,
        pageSize: 10,
      };
      try {
        const ret = yield call(getSubAccountLoginHistory, { ...params });
        const { success } = ret;
        ret.items = (ret.items || []).map((item) => {
          const { time } = item;
          return {
            ...item,
            time: moment(time).format('YYYY/MM/DD HH:mm:ss'),
          };
        });

        if (success) {
          yield put({
            type: 'savePage',
            payload: ret,
          });
        }
      } catch (e) {
        if (e.code && (+e.code === 400001 || +e.code === 400002)) {
        } else {
          throw e;
        }
      }
    },

    *getSubAccountListWithoutPage({ payload }, { call, put }) {
      const { data } = yield call(getSubAccountListWithoutPage);

      if (data && Array.isArray(data)) {
        yield put({
          type: 'update',
          payload: {
            subAccountList: (data || []).map((item) => ({
              text: item.subName,
              value: item.subUserId,
            })),
          },
        });
      }
    },
  },
});
