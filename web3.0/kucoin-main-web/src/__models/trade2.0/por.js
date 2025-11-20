/**
 * Owner: Judith@kupotech.com
 */

import extend from 'dva-model-extend';
import base from 'common/models/base';
import * as srv from 'services/trade2.0/por';

export default extend(base, {
  namespace: 'proof_of_reserves',
  state: {
    // 资产证明主页

    // 资产证明详情
    detail: {},
  },
  reducers: {},
  effects: {
    // 资产证明主页

    // 资产证明详情
    *pullDetail({ payload: { leafNodeId } }, { call, put }) {
      const res = yield call(srv.getAuditRecordDetail, { leafNodeId });
      const { success, data } = res || {};
      if (success) {
        yield put({
          type: 'update',
          payload: {
            detail: data,
          },
        });
      }
    },
    *downloadMerklePath({ payload: { leafNodeId } }, { call }) {
      const res = yield call(srv.downloadMerklePath, { leafNodeId });
      const { success, data } = res || {};
      if (success) {
        return data;
      }
      return null;
    },
  },
  subscriptions: {},
});
