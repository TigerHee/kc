/**
 * Owner: iron@kupotech.com
 */
import * as services from '../service';

import { PREFIX } from '../../common/constants';

export const namespace = `${PREFIX}_security_g2fa_auth`;

const initialValue = { loading: false, secretKey: '', countTime: {} };
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
    // 发送邮箱验证码
    *sendVerifyCode({ payload }, { call, put }) {
      const { bizType } = payload;
      yield put({ type: 'update', payload: { loading: true } });

      try {
        const result = yield call(services.sendEmailCodePost, {
          bizType,
          sendChannel: 'MY_EMAIL',
        });
        const { data: { maxRetryTimes, retryTimes, retryAfterSeconds } = {}, msg, code } = result;
        // 发送验证码，如果达到最大次数，则给出一个提示
        if (maxRetryTimes === retryTimes) {
          throw msg;
        }
        if (code === '200') {
          yield put({
            type: 'update',
            payload: { countTime: { time: retryAfterSeconds } },
          });
        }
      } finally {
        yield put({ type: 'update', payload: { loading: false } });
      }
    },
    *getG2faKey({ payload }, { call, put }) {
      const { data: secretKey } = yield call(services.getG2faKey, payload);
      yield put({ type: 'update', payload: { secretKey } });
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
