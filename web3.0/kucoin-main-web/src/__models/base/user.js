/**
 * Owner: willen@kupotech.com
 */
/**
 * 性能优化
 * pull user 会产生多个模型的依赖 如 currency / market 这些模型在注册的时候，会带来额外的 subscriptions
 * 现在将 pullUser 之后的操作移到模型内部观察 user 状态
 */
import bizTools from '@kucoin-biz/tools';
import { tenantConfig } from 'config/tenant';
import { FROZEN_STATUS } from 'codes';
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { delay } from 'redux-saga';
import * as userService from 'services/user';
import { setCsrf } from 'tools/request';
import sentry from '@kc/sentry';

export default extend(base, {
  namespace: 'user',
  state: {
    frozen: undefined, // undefined表示pullUser未返回
    user: undefined, // undefined表示未从服务器拉取
    isLogin: undefined,
    securtyStatus: {},
    frozenStatus: {},
    timeZones: [],
    timeZonesV2: [],
    conflictModal: false,
    balanceCurrency: 'USDT', // 计价单位
    is_blocked_country: false,
    restrictedStatus: -1, // 清退(受限)用户状态，如果status =[1,2]说明是被清退的用户(-1, 不是 1疑似 2 确定是)，需要弹窗提示
    restrictedUserNotice: null, //
    restrictedTypes: null, // 是否开启清退标识（kyc认证，充币）
    userLabel: null, // 用户标签
    recharged: null, // 用户充值记录
    traded: null, // 用户交易记录
    showDepositGuide: false, // 显示入金引导
  },
  reducers: {},
  effects: {
    *pullUser({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(userService.pullUserInfo);
        if (data) {
          if (tenantConfig.enableIpRestrictLang) {
            // ip合规语言以CF边缘标识为准
            if (!!window.ipRestrictCountry && window.ipRestrictCountry === data?.language) {
              data.language = 'en_US';
            }
          }
          // const csrfRes = yield call(userService.pullCsrf);
          // sentry identify user
          sentry.setUser({ id: data.uid });
          setCsrf(data.csrf);
          bizTools.setCsrf(data.csrf);

          import('tools/ext/kc-report').then(({ default: Report }) => {
            Report.setIDConfig(data.uid);
          });
          import('tools/ext/kc-sensors').then(({ default: sensors }) => {
            sensors.login(String(data.uid), String(data.honorLevel));
          });
          // 页面插件上报
          if (window.extensionDetector) {
            window.extensionDetector.detectAndReport({
              uid: data.uid,
              sence: 'login',
            });
          }
          // 获取用户被清退状态
          yield put({
            type: 'getUserRestrictedStatus',
          });
        }
        const { type: _type = 1, balanceCurrency = 'USDT' } = data || {};
        if (data) data.isSub = _type === 3;
        console.log('data.status === FROZEN_STATUS:', data.status === FROZEN_STATUS);
        yield put({
          type: 'update',
          payload: {
            user: data || null,
            isLogin: true,
            frozen: data ? data.status === FROZEN_STATUS : false,
            balanceCurrency:
              balanceCurrency && balanceCurrency !== 'null' ? balanceCurrency : 'USDT',
          },
        });

        // 登陆后自动获取入金记录
        yield put({
          type: 'getUserDepositFlag',
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
          // 拉取鼓励金数据
          // yield put({
          //   type: 'bonus/pullReferralSummary',
          // });
          // yield put({
          //   type: 'bonus/pullBonusSummary',
          // });
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
          //   securtyStatus: {
          //     "PERSONAL_KYC": false,
          //     "WITHDRAW_PASSWORD": false,
          //     "VOICE": false,
          //     "SMS": false,
          //     "COMPANY_KYC": false,
          //     "LOGIN_IP_PROTECT": false,
          //     "EMAIL": false,
          //     "GOOGLE2FA": false,
          // }
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
    *pullPxUserInfo(_, { call, put }) {
      const { data } = yield call(userService.pullPxUserInfo);
      if (data && data.is_blocked_country) {
        yield put({
          type: 'update',
          payload: {
            is_blocked_country: data.is_blocked_country,
          },
        });
      }
    },
    *getUserRestrictedStatus({ payload, onlyStatus = true }, { put, call }) {
      const queryHandler = onlyStatus
        ? userService.getUserRestrictedStatus
        : userService.getUserRestrictedStatusAndNotice;
      const { data } = yield call(queryHandler, payload);
      const { data: openFlag } = yield call(userService.getUserRestrictType, payload);
      const updateState = {};
      if (onlyStatus) {
        updateState.restrictedStatus = data;
      } else {
        updateState.restrictedUserNotice = data;
      }
      yield put({
        type: 'update',
        payload: {
          ...updateState,
          restrictedTypes: openFlag,
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

    *getUserDepositFlag({ payload }, { call, put }) {
      const { success, data = {} } = yield call(userService.getUserDepositFlag);
      if (success)
        yield put({
          type: 'update',
          payload: { recharged: data && data.recharged, traded: data && data.traded },
        });
    },
  },
});
