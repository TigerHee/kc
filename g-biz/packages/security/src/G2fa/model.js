/**
 * Owner: iron@kupotech.com
 */
import * as services from './service';

import { PREFIX } from '../common/constants';

import { namespace as authNamespace } from './AuthForm/model';

export const namespace = `${PREFIX}_security_g2fa`;

const SEND_CHANNEL = 'MY_EMAIL';

const initialValue = { securityMethods: {}, userInfo: {}, activeStep: 0, loading: false };

export default {
  namespace,
  state: initialValue,
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 获取用户信息
    *getUserInfo({ payload }, { call, put }) {
      const { data: userInfo } = yield call(services.getUserInfo, payload);
      yield put({ type: 'update', payload: { userInfo } });
    },
    *getSecurityMethods({ payload }, { call, put }) {
      const { data: securityMethods } = yield call(services.getSecurityMethods, payload);
      yield put({ type: 'update', payload: { securityMethods } });
    },
    // 校验安全验证
    *verifyGoogleCode({ payload }, { call }) {
      return yield call(services.verifyCodePost, payload);
    },
    // 验证验证码
    *verifyCode({ payload }, { call, put }) {
      const { bizType, code, verifyCode, callBack } = payload;
      const { code: dataCode } = yield call(services.verifyCodePost, {
        validations: { [SEND_CHANNEL]: verifyCode },
        bizType,
      });
      if (dataCode === '200') {
        callBack();
        return yield put({ type: 'bindG2fa', payload: { code } });
      }
      return false;
    },
    *bindG2fa({ payload }, { call, select }) {
      const { secretKey } = yield select((state) => state[authNamespace]);
      return yield call(services.bindG2faPost, { ...payload, key: secretKey });
    },
    *updateG2fa({ payload }, { call, select }) {
      const { secretKey } = yield select((state) => state[authNamespace]);
      return yield call(services.updateG2faPost, { ...payload, key: secretKey });
    },
    // 重置所有参数
    *resetInit(_, { put }) {
      yield put({
        type: 'update',
        payload: initialValue,
      });
    },
  },
};
