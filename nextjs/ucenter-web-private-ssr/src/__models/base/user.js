import * as sentry from '@sentry/nextjs';
import base from '@/common/models/base';
import extend from 'dva-model-extend';
import * as telemetry from '@/core/telemetryModule';
import { setCsrf } from 'tools/request';
import * as userService from 'services/user';
import { bootConfig } from 'kc-next/boot';
import { IS_CLIENT_ENV } from 'kc-next/env';
import { client } from '@/api/client.gen';

const FROZEN_STATUS = 3;

let getInitalState = () => {
  // 客户端渲染时，优先使用服务端注入的用户状态
  if (IS_CLIENT_ENV && window.__NEXT_DATA__?.props?.pageProps?.initialDvaState?.user) {
    return window.__NEXT_DATA__?.props?.pageProps?.initialDvaState?.user;
  }
  return {
    frozen: null, // undefined表示pullUser未返回
    user: null, // TODO 这里改成 null 是否有问题 undefined表示未从服务器拉取
    isLogin: null,
    securtyStatus: {},
    frozenStatus: {},
    timeZones: [],
    timeZonesV2: [],
    conflictModal: false,
    balanceCurrency: bootConfig._BASE_CURRENCY_, // 计价单位
    restrictedStatus: -1, // 清退(受限)用户状态，如果status =[1,2]说明是被清退的用户(-1, 不是 1疑似 2 确定是)，需要弹窗提示
    restrictedUserNotice: null, //
    restrictedTypes: null, // 是否开启清退标识（kyc认证，充币）
    userLabel: null, // 用户标签
    latestIp: null, // 用户最近一次登陆ip
    recharged: null, // 用户充值记录
    traded: null, // 用户交易记录
  };
};

export default extend(base, {
  namespace: 'user',
  state: getInitalState(),
  reducers: {},
  effects: {
    *pullUser({ payload }, { call, put }) {
      try {
        const { data } = yield call(userService.pullUserInfo);
        if (data) {
          // ip合规语言以CF边缘标识为准
          if (
            typeof window !== 'undefined' &&
            !!window.ipRestrictCountry &&
            window.ipRestrictCountry === data?.language
          ) {
            data.language = 'en_US';
          }

          sentry.setUser({ id: data.uid });
          setCsrf(data.csrf);
          client.refreshCsrfToken(data.csrf);

          import('@kc/socket').then((ws) => {
            ws.setCsrf(data.csrf);
          });

          telemetry.setReportIdConfig(data.uid);
          telemetry.loginSensors(data.uid, data.honorLevel);
          telemetry.reportExtension(data);
        }
        const { type: _type = 1, balanceCurrency = bootConfig._BASE_CURRENCY_ } = data || {};
        if (data) data.isSub = _type === 3;
        yield put({
          type: 'update',
          payload: {
            user: data || null,
            isLogin: true,
            frozen: data ? data.status === FROZEN_STATUS : false,
            balanceCurrency:
              balanceCurrency && balanceCurrency !== 'null'
                ? balanceCurrency
                : bootConfig._BASE_CURRENCY_,
          },
        });

        // 登陆后自动获取入金记录
        yield put({
          type: 'getUserDepositFlag',
        });

        if (data) {
          const { id } = data;
          yield put({
            type: 'pullSecurtyMethods',
            payload: { id },
          });
        }
      } catch (e) {
        console.log('user-info error..', e);
        // 调用 callback 回调函数
        if (payload && payload.callback) {
          payload.callback(e?.code);
        }
        yield put({
          type: 'checkUserError',
          payload: {
            error: e,
          },
        });
      }
    },
    *pullUserServer({ payload }, { call, put }) {
      try {
        const { data } = yield call(userService.pullUserInfo);
        const { type: _type = 1, balanceCurrency = bootConfig._BASE_CURRENCY_ } = data || {};
        if (data) data.isSub = _type === 3;
        yield put({
          type: 'update',
          payload: {
            user: data || null,
            isLogin: true,
            frozen: data ? data.status === FROZEN_STATUS : false,
            balanceCurrency:
              balanceCurrency && balanceCurrency !== 'null'
                ? balanceCurrency
                : bootConfig._BASE_CURRENCY_,
          },
        });
        return true;
      } catch (e) {
        console.error('pullUserServer error', e);
        return false;
      }
    },
    // 检查user-info接口错误原因
    *checkUserError({ payload: { error } }, { put }) {
      const { code } = error;
      switch (code) {
        // 默认抛出错误给showError处理
        default:
          yield put({
            type: 'update',
            payload: {
              user: null,
              frozen: false,
              isLogin: false,
            },
          });
          // 保持原有逻辑，先不改动
          throw error;
      }
    },
    *getUserDepositFlag({ payload }, { call, put }) {
      const { success, data = {} } = yield call(userService.getUserDepositFlag);
      if (success) {
        yield put({
          type: 'update',
          payload: { recharged: data && data.recharged, traded: data && data.traded },
        });
      }
    },
    *pullSecurtyMethods({ payload: { id } }, { call, put }) {
      const res = yield call(userService.pullSecurtyMethods, id);
      yield put({
        type: 'update',
        payload: {
          securtyStatus: res.data,
        },
      });
    },
    *pullTimeZones(action, { call, put }) {
      const { data } = yield call(userService.getTimeZones);
      if (data) {
        yield put({
          type: 'update',
          payload: {
            timeZones: data,
          },
        });
      }
    },
    *pullTimeZonesV2(action, { call, put }) {
      const { data } = yield call(userService.getTimeZonesV2);
      if (data) {
        yield put({
          type: 'update',
          payload: {
            timeZonesV2: data,
          },
        });
      }
    },

    *setLocal({ payload: { params, reloadUser = true } }, { call, put }) {
      yield call(userService.setLocal, params);
      if (reloadUser) {
        yield put({ type: 'pullUser' });
      }
    },
    *setBalanceCurrency({ payload }, { call, put, select }) {
      const { balanceCurrency } = payload || {};
      if (balanceCurrency) {
        yield call(userService.setLocal, { balanceCurrency });
        const { user } = yield select((state) => state.user);
        const _user = user
          ? {
            ...user,
            balanceCurrency,
          }
          : user;

        yield put({
          type: 'update',
          payload: {
            balanceCurrency,
            user: _user,
          },
        });
      }
    },
    *pullUserAvatarList(_, { call }) {
      const { data } = yield call(userService.getUserAvailableAvatar);
      return data;
    },
    *updateUserAvatar({ payload: { code } }, { put, call }) {
      yield call(userService.updateAvatar, { code });
      yield put({ type: 'pullUser' });
    },
    *updateNickName({ payload: { nickname } }, { put, call }) {
      yield call(userService.udpateNickName, { nickname });
      yield put({ type: 'pullUser' });
    },
    *getUserFrozenStatus(_, { call, put }) {
      const res = yield call(userService.getUserFrozenStatus);
      yield put({
        type: 'update',
        payload: {
          frozenStatus: res.data,
        },
      });
    },
    *getUserRestrictedStatus({ payload }, { put, call }) {
      const { data } = yield call(userService.getUserRestrictedStatusAndNotice, payload);
      yield put({
        type: 'update',
        payload: {
          restrictedUserNotice: data || {},
        },
      });
    },
    // 获取用户标签
    *getUserLabel(a, { call, put }) {
      const result = yield call(userService.getUserLabel);
      if (result && result.success) {
        yield put({
          type: 'update',
          payload: {
            userLabel: result.data,
          },
        });
      }
      return result;
    },
    // 获取客户经理服务状态
    *getManagerStatus(_, { call, put }) {
      const result = yield call(userService.getManagerStatus);
      if (result && result.success) {
        yield put({
          type: 'update',
          payload: {
            managerStatus: result.data,
          },
        });
      }
      return result;
    },

    *loginVerify({ payload, isCommon, bizType }, { call, put }) {
      let serviceFn = isCommon ? 'commonLoginVerify' : 'loginVerify';
      if (bizType === 'FORGOT_PASSWORD') {
        serviceFn = 'forgetPwdVerify';
      }
      const { data } = yield call(userService[serviceFn], payload);
      yield put({
        type: 'update',
        payload: {
          loginVerifyResult: data.status,
        },
      });
    },
  },
});
