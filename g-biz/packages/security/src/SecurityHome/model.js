/**
 * Owner: iron@kupotech.com
 */
import * as services from './service';

import { PREFIX } from '../common/constants';

export const namespace = `${PREFIX}_security_home`;

const initialValue = { userInfo: {}, securityMethods: {} };

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
    // 获取用户已经设置的安全保护措施
    *getSecurityMethods({ payload }, { call, put }) {
      const { data: securityMethods } = yield call(services.getSecurityMethods, payload);
      yield put({ type: 'update', payload: { securityMethods } });
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
