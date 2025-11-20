/**
 * Owner: mcqueen@kupotech.com
 */
import base from 'common/models/base';
import clearRecords from 'common/models/clearRecords';
import pagination from 'common/models/paginate';
import omit from 'common/models/utils/omit';
import extend from 'dva-model-extend';
import moment from 'moment';
import { getSubAccountListWithoutPage, getSubAccountTransferHistory } from 'services/account';
import { _t } from 'tools/i18n';

export default extend(base, pagination, clearRecords, {
  namespace: 'sub_history_transfer',
  state: {
    filters: {},
    accountList: [],
  },
  effects: {
    *query(_, { select, call, put }) {
      const { filters } = yield select((state) => state.sub_history_transfer);
      const { user } = yield select((state) => state.user);
      const _filters = omit(filters);
      const [start, end] = _filters.rangeDate || [];

      const { payOwnerId, recOwnerId } = _filters;

      const params = {
        payOwnerId,
        recOwnerId,
        createdAtGe: start && moment(start).valueOf() * 1,
        createdAtLe: end && moment(end).valueOf() * 1,
        pageNo: _filters.currentPage * 1,
        pageSize: 10,
      };

      if (payOwnerId) {
        params.mainPayOwner = payOwnerId === user.uid;
      }

      if (recOwnerId) {
        params.mainRecOwner = recOwnerId === user.uid;
      }

      try {
        const ret = yield call(getSubAccountTransferHistory, { ...params });
        const { success } = ret;
        ret.items = (ret.items || []).map((item) => {
          const { createdAt } = item;
          return {
            ...item,
            time: moment(createdAt).format('YYYY/MM/DD HH:mm:ss'),
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
    *getAccountList({ payload }, { call, put, select }) {
      const { data } = yield call(getSubAccountListWithoutPage);
      const { user } = yield select((state) => state.user);

      if (data && Array.isArray(data)) {
        yield put({
          type: 'update',
          payload: {
            accountList: [
              {
                text: _t('master.account'),
                value: user.uid,
              },
              ...(data || []).map((item) => ({
                text: item.subName,
                value: item.subUserId,
              })),
            ],
          },
        });
      }
    },
  },
});
