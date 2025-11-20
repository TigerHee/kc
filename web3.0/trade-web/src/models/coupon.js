/**
 * Owner: solarxia@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import * as serv from 'services/coupon';

export default extend(base, {
  namespace: 'coupon',
  state: {
    usableCouponList: [],
  },
  effects: {
    *queryUsableCoupon({ payload = {} }, { put, call }) {
      const { success, items } = yield call(serv.queryUsableCoupon, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            usableCouponList: items,
          },
        });
      }
    },
    // 从卡券中心获取卡券
    // *querySpotCouponFromConponCenter({ payload = {} }, { put, call }) {
    //   const { success, items } = yield call(serv.queryCouponFromConponCenter, {
    //     page: 1,
    //     pageSize: 100,
    //     prizeType: 7,
    //     ...payload,
    //   });
    //   if (success) {
    //     yield put({
    //       type: 'update',
    //       payload: {
    //         usableCouponList: items,
    //       },
    //     });
    //   }
    // },
  },
  reducers: {},
  subscriptions: {},
});
