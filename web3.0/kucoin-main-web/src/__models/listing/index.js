/**
 * Owner: tom@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { getSummary, saveDraft, applySubmit, uploadFile } from 'services/listing';

export default extend(base, {
  namespace: 'listing',
  state: {
    applyCurrentStep: 0,
    detail: {},
  },
  effects: {
    *getSummary({ payload = {} }, { put, call }) {
      const { data = {} } = yield call(getSummary, payload);
      yield put({
        type: 'update',
        payload: {
          detail: data || {},
          applyCurrentStep: data && data.status > 0 ? 3 : 0,
        },
      });
    },
    *saveDraft({ payload = {} }, { call }) {
      const res = yield call(saveDraft, payload);
      return res;
    },
    *applySubmit({ payload = {} }, { call }) {
      const res = yield call(applySubmit, payload);
      return res;
    },
    *uploadFile({ payload = {} }, { call }) {
      const res = yield call(uploadFile, payload);
      return res;
    },
  },
});
