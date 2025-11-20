/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { queryNotice, sendNoticeCallback } from 'services/publicNoticeDialog';

export default extend(base, {
  namespace: 'publicNoticeDialog',
  state: {
    noticeInfo: {},
  },
  effects: {
    *getNotice({ payload }, { put, call }) {
      const { success, data } = yield call(queryNotice, payload);
      if (success) {
        const { module } = payload;
        yield put({
          type: 'update',
          payload: { noticeInfo: data ? data.find((i) => i.module === module) || {} : {} },
        });
      }
    },
    *sendNoticeCallback({ payload }, { call }) {
      return yield call(sendNoticeCallback, payload);
    },
  },
});
