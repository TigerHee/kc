/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import base from './base';

import { getKycCode } from 'services/kyc';

export default extend(base, {
  state: {
    kycCode: '',
  },
  effects: {
    *getKycCode(_, { put, call }) {
      const { data } = yield call(getKycCode);
      yield put({
        type: 'update',
        payload: {
          kycCode: data,
        },
      });
    },
  },
});
