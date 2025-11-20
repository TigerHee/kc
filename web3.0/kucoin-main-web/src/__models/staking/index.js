/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { getStaking } from 'services/account';

export default extend(base, {
  namespace: 'staking',
  state: {
    records: [],
  },
  effects: {
    *pull(__, { put, call }) {
      const { items } = yield call(getStaking);
      yield put({
        type: 'update',
        payload: {
          records: items,
        },
      });
    },
  },
});
