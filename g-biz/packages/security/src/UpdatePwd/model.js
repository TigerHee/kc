/**
 * Owner: iron@kupotech.com
 */
import * as services from './service';

import { PREFIX } from '../common/constants';

export const namespace = `${PREFIX}_security_update_password`;

const initialValue = { loading: false };
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
    // 更新密码
    *updatePassword({ payload }, { call }) {
      return yield call(services.updatePasswordPost, payload);
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
