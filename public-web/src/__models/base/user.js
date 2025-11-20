/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
// import * as config from '../config';
// import _ from 'lodash';
// import { delay } from 'utils/delay';
import sentry from '@kc/sentry';
import remoteTools from '@kucoin-biz/tools';
import { FROZEN_STATUS } from 'codes';
import base from 'common/models/base';
import { BASE_CURRENCY } from 'config/base';
import { tenantConfig } from 'config/tenant';
import * as userService from 'services/user';
import Report from 'tools/ext/kc-report';
import { setCsrf } from 'tools/request';

export default extend(base, {
  namespace: 'user',
  state: {
    frozen: undefined, // undefined表示pullUser未返回
    user: undefined, // undefined表示未从服务器拉取
    isLogin: undefined,
    securtyStatus: {},
    frozenStatus: {},
    timeZones: [],
    conflictModal: false,
    balanceCurrency: BASE_CURRENCY, // 计价单位
    restrictedStatus: -1, // 清退(受限)用户状态，如果status =[1,2]说明是被清退的用户(-1, 不是 1疑似 2 确定是)，需要弹窗提示
    restrictedUserNotice: null, //
    restrictedTypes: null, // 是否开启清退标识（kyc认证，充币）
    userLabel: undefined, // 用户标签
    latestIp: null, // 用户最近一次登陆ip
    recharged: null, // 用户充值记录
    traded: null, // 用户交易记录
    showDepositGuide: false, // 显示入金引导
    referralCode: null, // 用户邀请码，不再从userInfo里去取
  },
  reducers: {},
  effects: {
    *pullUser({ payload }, { call, put }) {
      try {
        const { data } = yield call(userService.pullUserInfo);
        if (data) {
          // ip合规语言以CF边缘标识为准
          if (tenantConfig.enableIpRestrictLang) {
            if (!!window.ipRestrictCountry && window.ipRestrictCountry === data?.language) {
              data.language = 'en_US';
            }
          }
          sentry.setUser({ id: data.uid });
          setCsrf(data.csrf);
          import('@kc/socket').then((ws) => {
            ws.setCsrf(data.csrf);
          });
          remoteTools.setCsrf(data.csrf);
          // yield put({
          //   type: 'app/selectLang',
          //   payload: {
          //     lang: data.language || currentLang || initedLang || 'en_US',
          //     callService: data.language !== currentLang || data.language === null,
          //     reload:
          //       data.language !== currentLang &&
          //       !(data.language === 'ja_JP' && window.location.pathname === '/'),
          //     auser: !!data,
          //   },
          // });
          import('tools/ext/kc-sensors').then(({ default: sensors }) => {
            sensors.login(String(data.uid), String(data.honorLevel));
          });

          Report.setIDConfig(data.uid);
        }
        const { type: _type = 1, balanceCurrency = BASE_CURRENCY } = data || {};
        if (data) data.isSub = _type === 3;
        yield put({
          type: 'update',
          payload: {
            user: data || null,
            isLogin: true,
            frozen: data ? data.status === FROZEN_STATUS : false,
            balanceCurrency:
              balanceCurrency && balanceCurrency !== 'null' ? balanceCurrency : BASE_CURRENCY,
          },
        });

        // 登陆后自动获取入金记录
        yield put({
          type: 'getUserDepositFlag',
        });

        // 登陆后自动获取邀请码
        yield put({
          type: 'getReferralCode',
        });
        // 首次加载用户时需要初始化语言选项
        // if (payload && Object.prototype.hasOwnProperty.call(payload, 'firstCall')) {
        //   yield put({ type: 'app/initDefaultLang' });
        // }
        if (data) {
          const { id } = data;
          yield put({
            type: 'pullSecurtyMethods',
            payload: { id },
          });
        }
        // yield put({ type: 'app/connectWs' });
      } catch (e) {
        yield put({
          type: 'checkUserError',
          payload: {
            error: e,
          },
        });
      }
    },
    *checkUserConflict(__, { put, call }) {
      const { data } = yield call(userService.validateConflict);
      if (data) {
        yield put({
          type: 'update',
          payload: {
            conflictModal: true,
          },
        });
      }
    },
    // 检查user-info接口错误原因
    *checkUserError({ payload: { error } }, { put }) {
      const { code } = error;
      switch (code) {
        // 现在frozen的状态由userInfo的status字段决定，不走checkUserError
        // 账户被冻结
        // case ACCOUNT_FROZEN:
        //   yield put({
        //     type: 'update',
        //     payload: {
        //       frozen: true,
        //     },
        //   });
        //   yield put({
        //     type: 'account_freeze/updateFrozenTime',
        //     payload: {
        //       frozenTime: Number(data),
        //     },
        //   });
        //   break;
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
          throw error;
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
      yield put({
        type: 'pullUser',
      });
    },
    *updateNickName({ payload: { nickname } }, { put, call }) {
      yield call(userService.udpateNickName, { nickname });
      yield put({
        type: 'pullUser',
      });
    },
    // 这个 effect 没调用，但会引入 wallet_lock 的依赖，注释掉
    // *checkWalletLock(action, { put }) {
    //   yield put({
    //     type: 'wallet_lock/checkIsConfirmed',
    //   });
    // },
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

    *getUserDepositFlag({ payload }, { call, put }) {
      const { success, data = {} } = yield call(userService.getUserDepositFlag);
      if (success) {
        yield put({
          type: 'update',
          payload: { recharged: data && data.recharged, traded: data && data.traded },
        });
      }
    },
    // 获取用户邀请码
    *getReferralCode(__, { call, put }) {
      const { success, data = {} } = yield call(userService.getReferralCode);
      if (success) {
        yield put({
          type: 'update',
          payload: { referralCode: data.referralCode },
        });
      }
    },
  },
});
