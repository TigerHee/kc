/**
 * Owner: iron@kupotech.com
 */
import * as services from './service';
import { NAME_SPACE, ERROR_CONFIG, ERROR_ENUM } from '../../config';
import { ga } from '../../helper';

let registerSeq = 3;

export default {
  namespace: NAME_SPACE,

  state: {
    cursor: '',
  },

  effects: {
    *register({ payload }, { call, put }) {
      try {
        const data = yield call(services.register, payload);
        if (data.code === ERROR_ENUM.SUCCESS) {
          // 注册成功，就帮直接登录
          yield put({ type: 'login', payload });
        } else {
          ga('app_otc_im_exception_code', { data: JSON.stringify(data), type: 'register' });
        }
      } catch (e) {
        ga('app_otc_im_exception_code', { data: JSON.stringify(e), type: 'register' });
      }
    },
    *login({ payload }, { call, put }) {
      const data = yield call(services.login, payload);
      if (data.code === ERROR_ENUM.SUCCESS || data.code === ERROR_ENUM.ALREADY_LOGIN) {
        return true;
      }
      if (data.code === ERROR_ENUM.USER_NOT_EXIST) {
        // 未注册，就帮注册
        if (registerSeq === 0) return false;
        yield put({
          type: 'register',
          payload,
        });
        registerSeq -= 1;
      } else {
        ga('app_otc_im_exception_code', { data: JSON.stringify(data), type: 'login' });
      }
      console.error(ERROR_CONFIG[data.code]);
      return false;
    },
    *sendSingleMsg({ payload }, { call }) {
      try {
        const data = yield call(services.sendSingleMsg, payload);
        return data.msg_id || '';
      } catch (e) {
        ga('app_otc_im_exception_code', { data: JSON.stringify(e), type: 'sendSingleMsg' });
        console.error('e:', e);
        return false;
      }
    },
    *sendSinglePic({ payload }, { call }) {
      try {
        payload.image = payload.content;
        delete payload.content;
        const data = yield call(services.sendSinglePic, payload);
        return data.msg_id || '';
      } catch (e) {
        console.error('e:', e);
        ga('app_otc_im_exception_code', { data: JSON.stringify(e), type: 'sendSinglePic' });
        return false;
      }
    },
    *addSingleReceiptReport({ payload }, { call }) {
      const data = yield call(services.addSingleReceiptReport, payload);
      if (data.code === ERROR_ENUM.SUCCESS) {
        return true;
      }
      console.error(ERROR_CONFIG[data.code]);
      return false;
    },
    *getResource({ payload }, { call }) {
      const data = yield call(services.getResource, payload);
      if (data.code !== ERROR_ENUM.SUCCESS) {
        console.error(ERROR_CONFIG[data.code]);
        return false;
      }
      return data.url;
    },
    *getIMHistory({ payload }, { call, put }) {
      const { data } = yield call(services.getIMHistory, payload);
      if (!data || !data.messages) return { success: false, messages: [] };
      const { cursor, messages } = data;
      yield put({ type: 'update', payload: { cursor } });
      return { success: true, messages }; // eslint-disable-line
    },
  },

  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
