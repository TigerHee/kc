/**
 * Owner: tiger@kupotech.com
 */
import extend from 'dva-model-extend';
import polling from '@kc/gbiz-base/lib/polling';
import * as serv from './services';

export const NAMESPACE = 'common_mail_authorize';

const initialState = {
  visible: false,
  riskTag: '',
  verifyToken: '',
  verifyCheckToken: '',
};

export default extend(polling, {
  namespace: NAMESPACE,
  state: {
    ...initialState,
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    reset(state) {
      return {
        ...state,
        ...initialState,
      };
    },
  },
  effects: {
    *checkRisk({ payload = {}, onSuccess, onError }, { call, put }) {
      try {
        const res = yield call(serv.checkRisk, payload);
        const { riskTag } = res.data;
        // accept：通过； verify: 授权验证；  reject 拒绝
        const isNeedVerify = riskTag === 'verify';
        yield put({
          type: 'update',
          payload: {
            visible: isNeedVerify,
            ...res.data,
          },
        });
        if (!isNeedVerify && typeof onSuccess === 'function') onSuccess(res.data);
      } catch (e) {
        if (typeof onError === 'function') onError(e);
      }
    },
    *resendEmail({ payload = {} }, { call, put, select }) {
      const { verifyToken, verifyCheckToken } = yield select((state) => state[NAMESPACE]);
      const res = yield call(serv.resendEmail, { verifyToken, verifyCheckToken, ...payload });
      yield put({
        type: 'update',
        payload: res.data,
      });
      return res;
    },
    *getMailVerifyResult({ payload = {} }, { call, put, select }) {
      const { verifyToken, verifyCheckToken } = yield select((state) => state[NAMESPACE]);
      try {
        const { data } = yield call(serv.queryResult, { verifyToken, verifyCheckToken });
        if (data?.status === 'success') {
          yield put({ type: 'reset' });
          if (typeof payload?.onSuccess === 'function') {
            payload.onSuccess();
          }
        }
      } catch (e) {
        if (typeof payload?.onError === 'function') {
          payload.onError(e);
        }
      }
    },
    *triggerPolling(__, { put }) {
      yield put({
        type: 'watchPolling',
        payload: { effect: 'getMailVerifyResult', interval: 5 * 1000 },
      });
    },
  },
});
