/**
 * Owner: iron@kupotech.com
 */
import * as services from './service';

import { PREFIX } from '../common/constants';

export const namespace = `${PREFIX}_security_set_trade_password`;

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
    // 设置密码
    *setTradePwd({ payload }, { call }) {
      return yield call(services.setTradePasswordPost, payload);
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
