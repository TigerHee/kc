/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { cryptoPwd } from 'helper';
import { getAssetDetail } from 'services/assets';
import * as serv from 'services/security';
import { pullUserExternalBindings } from 'services/user';
import waitFor from 'src/utils/waitForSaga';

const crypto = (str) => {
  return cryptoPwd(str);
};

export default extend(base, {
  namespace: 'account_security',
  state: {
    g2faKey: null,
    noticeStatus: {},
    externalBindings: [], // 已绑定的三方账号
  },
  reducers: {},
  effects: {
    *getExternalBindings({}, { call, put }) {
      const res = yield call(pullUserExternalBindings);
      yield put({
        type: 'update',
        payload: {
          externalBindings: res?.data?.filter((i) => i.status === 1) || [],
        },
      });
    },
    *sendVerifyCode({ payload: { params } }, { call }) {
      const result = yield call(serv.getValidationCode, params);
      return result;
    },
    *sendBindCode({ payload: { type, params } }, { call }) {
      let api;
      if (type === 'phone') {
        api = serv.sendPhoneBindCode;
      }
      if (type === 'email') {
        api = serv.sendEmailBindCode;
      }
      const { data } = yield call(api, params);
      return data;
    },
    *verifyCode({ payload: { params } }, { call }) {
      yield call(serv.verify, params);
    },
    *bindEmail({ payload: { params } }, { call, put }) {
      yield call(serv.bindEmail, params);
      yield put({ type: 'user/pullUser' });
    },
    *updateEmail({ payload: { params } }, { call, put }) {
      const updateEmailRes = yield call(serv.updateEmail, params);
      return updateEmailRes;
    },
    *bindPhone({ payload: { params } }, { call, put }) {
      yield call(serv.bindPhone, params);
      yield put({ type: 'user/pullUser' });
    },
    *unbindPhone({ payload }, { call }) {
      const res = yield call(serv.unbindPhone, payload);
      return res;
    },
    *unbindCallback(_, { put }) {
      // 需要先调用一下网关的 logout 接口，否则解绑完成登陆态失效有延迟
      yield put({ type: 'app/logout', payload: { notReload: true } });
      yield put({ type: 'user/pullUser' });
    },
    *updatePhone({ payload: { params } }, { call, put }) {
      const updatePhoneRes = yield call(serv.updatePhone, params);
      return updatePhoneRes;
    },
    *updatePhoneV2({ payload: { params } }, { call, put }) {
      const updatePhoneRes = yield call(serv.updatePhoneV2, params);
      return updatePhoneRes;
    },
    // 获取谷歌两步验证key
    *getG2FAKey(a, { call, put }) {
      const key = yield call(serv.getG2FAKey);
      yield put({
        type: 'update',
        payload: {
          g2faKey: key.data,
        },
      });
      return key.data;
    },
    *bindG2AF({ payload = {} }, { call, put }) {
      const { code, key, isUpdate = false, headers } = payload;
      console.log(code, key);
      const result = yield call(serv.bindG2AF, {
        code,
        // key, 不传入 key, 有安全风险
        isUpdate,
        headers,
      });
      yield put({ type: 'user/pullUser' });
      return result;
    },
    // 更新登录密码
    *updateLP({ payload }, { call }) {
      const { password, headers } = payload;
      const result = yield call(serv.updatePwd, {
        password: crypto(password),
        headers,
      });
      return result;
    },
    //  设置登录密码
    *setLoginPwd({ payload }, { call, put }) {
      const { password, headers } = payload;
      const result = yield call(serv.setPwd, {
        password: crypto(password),
        headers,
      });
      yield put({ type: 'user/pullUser' });
      return result;
    },
    // 设置更新 提现密码
    *modifyWithdrawPassword({ payload }, { call, put }) {
      const { password, isUpdate = false, headers } = payload;
      const method = isUpdate ? 'updateWithdrawPassword' : 'setWithdrawPassword';
      const result = yield call(serv[method], crypto(password), headers);
      yield put({ type: 'user/pullUser' });
      return result;
    },
    // 设置安全语
    *saveSafewords({ payload }, { call, put }) {
      const result = yield call(serv.saveSafewords, payload);
      yield put({
        type: 'getSafeWords',
      });
      yield put({ type: 'user/pullUser' });
      return result;
    },
    // 获取安全语
    *getSafeWords(a, { call, put }) {
      const result = yield call(serv.getSafeWords);
      if (result && result.code === '200') {
        const { loginSafeWord, mailSafeWord, withdrawalSafeWord } = result.data;
        yield put({
          type: 'update',
          payload: {
            loginSafeWord,
            mailSafeWord,
            withdrawalSafeWord,
          },
        });
      }
      return result;
    },
    *updateLoginIp({ payload }, { call, put, select }) {
      try {
        yield call(serv.updateLoginIp, payload);
      } finally {
        const { id } = yield select((state) => state.user.user);
        yield put({
          type: 'user/pullSecurtyMethods',
          payload: {
            id,
          },
        });
      }
    },
    *getNoticeStatus(__, { put, call }) {
      const { data } = yield call(serv.getNoticeStatus);
      data.currency = window._BASE_CURRENCY_;
      // 获取总资产，进一步判断是否需要显示弹窗
      if (data.needNotice) {
        const { data: assetsData } = yield call(getAssetDetail);
        if (Number(assetsData.totalUsdtamount) < data.balance) {
          data.needNotice = false;
        }
      }
      if (data) {
        yield put({
          type: 'update',
          payload: { noticeStatus: data },
        });
      }
    },
    *closeNotice(__, { put, call }) {
      try {
        yield call(serv.closeNotice);
      } finally {
        yield put({
          type: 'getNoticeStatus',
        });
      }
    },
    *freezeSelf({ callBack }, { call }) {
      let result = null;
      try {
        result = yield call(serv.freezeSelf);
        if (callBack) {
          callBack(result);
        }
      } finally {
        return result;
      }
    },
    *watchUser(action, { call, put, select, take }) {
      yield call(waitFor, (state) => !!state.user.user, { select, take });
      const user = yield select((state) => state.user.user);
      const { type = 1 } = user;
      if (!type || type !== 3) {
        yield put({
          type: 'getNoticeStatus',
        });
      }
    },
    *unbindEmail({ payload }, { call }) {
      const res = yield call(serv.unbindEmail, payload);
      return res;
    },
    *queryCancellationOverview(__, { call, put }) {
      const res = yield call(serv.getCancellationOverview);
      yield put({
        type: 'update',
        payload: { cancellationOverview: res.data },
      });
      return res;
    },
    /** 调用安全中心的发送验证码接口，后续各流程的发送验证码应该收敛到安全中心 */
    *sendPhoneCode({ payload }, { call }) {
      const { bizType, address, isVoice } = payload;
      const res = yield call(serv.sendValidationCode, {
        bizType,
        sendChannel: `${!address ? 'MY_' : ''}${isVoice ? 'VOICE' : 'SMS'}`,
        address,
      });
      return res.data;
    },
  },
  subscriptions: {
    watch({ dispatch }) {
      dispatch({
        type: 'watchUser',
      });
    },
    // setUp({ dispatch }) {
    //   dispatch({
    //     type: 'getSafeWords',
    //   });
    // },
  },
});
