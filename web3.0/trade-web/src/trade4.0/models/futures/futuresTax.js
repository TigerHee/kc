/**
 * Owner: garuda@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';

import { getTaxFee } from '@/services/futures';

export default extend(base, {
  namespace: 'futuresTax',
  state: {
    taxRate: 0, // 税费
  },
  reducers: {},
  effects: {
    *getTaxFee({ payload }, { call, put }) {
      const result = yield call(getTaxFee, payload);
      if (result?.data) {
        yield put({
          type: 'update',
          payload: {
            taxRate: result.data?.feeTaxRate || 0,
          },
        });
      }
    },
  },
  subscriptions: {},
});
