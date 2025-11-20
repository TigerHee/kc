/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { getSubUserList } from 'services/commonBasis';
// import { TRADE_TYPE } from 'routes/OrderPage/config';

export default extend(base, {
  namespace: 'order_meta',
  state: {
    // tradeType: TRADE_TYPE[0].code,
    exportDrawerOpen: false,
    taxInvoiceDrawerOpen: false, // 税票导出抽屉开关
    subUserList: [], // 子账号列表
  },
  effects: {
    *fetchSubUserList(_, { call, put }) {
      try {
        const { data } = yield call(getSubUserList);
        if (data) {
          yield put({
            type: 'update',
            payload: {
              subUserList: data,
            },
          });
        }
      } catch (err) {
        console.log('fetch sub user list..', err);
      }
    },
  },
});
