/**
 * Owner: solar.xia@kupotech.com
 */

import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import { queryUsableCoupon } from 'services/feeDiscountCoupons';

export default extend(base, {
  namespace: 'coupon',
  state: {
    coupons: [],
  },
  reducers: {},
  effects: {
    *queryUsableCoupon({ payload = {} }, { call, put }) {
      const { items, success } = yield call(queryUsableCoupon, payload);
      if (success && items) {
        yield put({
          type: 'update',
          payload: {
            coupons: items,
          },
        });
      }
    },
  },
  subscriptions: {
    // setUp({ dispatch }) {
    //   dispatch({ type: 'pull' });
    // },
  },
});
