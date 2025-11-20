/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import { setCsrf } from 'utils/request';
import find from 'lodash/find';
import { kucoinStorage } from 'utils/storage';
import { getLocalBase, doNotSyncLangPath } from 'config';
import { searchToJson, checkPathname } from 'helper';
import * as userService from 'services/user';
import {
  sendValidateCode,
  sendBindPhoneCode,
  bindPhone,
  verifyValidateCode,
  pullSecurtyMethods,
} from 'services/user';
import { goBack } from 'umi/router';
import { _t, needConfirmLang } from 'utils/lang';
import { KcSensorsLogin } from 'utils/kcsensors';

const theme = 'light';
export default extend(base, {
  namespace: 'user',
  state: {
    // headerBackgroundColor: colors[theme].highEmphasis,
    headerBackgroundColor: '',
    user: undefined, // undefined表示未从服务器拉取
    isLogin: undefined,
    retryAfterSeconds: {},
    showLoginDrawer: false,
    reloadWhenLoginSuccess: false,
    showForgetPwdDrawer: false,
    securtyStatus: {},
    forceKycInfo: {},
  },
  effects: {
    *pullUser({ payload = {}, successCallback = null, errorCallback = null }, { call, put, select }) {
      let userData = null;
      try {
        const { data } = yield call(userService.pullUserInfo);
        if (data) {
          // ip合规语言以CF边缘标识为准
          // 语言地区合规
          if (!!window.ipRestrictCountry && window.ipRestrictCountry === data?.language) {
            data.language = 'en_US';
          }
          import('@kc/sentry').then(res => {
            const sentry = res.default;
            sentry?.setUser?.({ id: data.uid });
          });
          userData = data;
          // TODO 去掉接口，csrf从userInfo里面获取
          const csrfRes = yield call(userService.pullCsrf);
          setCsrf(csrfRes.data);
          System.import('@remote/tools').then((module) => {
            const { setCsrf: setRemoteCsrf } = module.default;
            setRemoteCsrf(data.csrf);
          });
          import('@kc/socket').then(ws => {
            ws.setCsrf(data.csrf);
          })
          const { type: _type = 1 } = data || {};
          if (data) data.isSub = _type === 3;
          yield put({
            type: 'update',
            payload: {
              user: data || null,
              isLogin: true,
            },
          });
          yield put({ type: 'pullSecurtyMethods' });
          if (successCallback && typeof successCallback === 'function') {
            successCallback();
          }
        }
        // window._KC_REPORT_ && window._KC_REPORT_.setIDConfig(data.referralCode);
        KcSensorsLogin(String(data.uid), String(data.honorLevel));
        import('@kc/report').then(({ default: Report }) => {
          Report.setIDConfig(data.uid);
        });
      } catch (e) {
          if (errorCallback && typeof errorCallback === 'function') {
            errorCallback(e);
          }
          yield put({
            type: 'checkUserError',
            payload: {
              error: e,
            },
          });
      } finally {
        // 无论如何都初始化一种语言，避免页面卡死
        // yield put({ type: 'app/initDefaultLang' });
        // let browserLanguage = getFirstBrowserLanguage();
        // browserLanguage = browserLanguage.replace('-', '_');

        const query = searchToJson();
        const { language } = userData || {};
        // const currentApp = yield select(state => state.app);
        const initedLang = kucoinStorage.getItem('lang');
        const { isExist: langByPath = window._DEFAULT_LANG_ } = getLocalBase();
        // 语言优先级顺序：用户语言，query参数，语言子路径, storage;
        let initLang = language || query.lang;
        if (!initLang) {
          if (langByPath === window._DEFAULT_LANG_ && initedLang) {
            initLang = initedLang;
          } else {
            initLang = langByPath;
          }
        }
        const confirmlang = needConfirmLang();
        const isNotSyncPath = checkPathname(doNotSyncLangPath);
        if (confirmlang && !isNotSyncPath) {
          yield put({
            type: 'app/selectLang',
            payload: {
              lang: initLang,
              auser: !!userData,
            },
          });
        }
      }
    },
    // 检查user-info接口错误原因
    *checkUserError({ payload: { error } }, { put }) {
      // const { code, data } = error;
      yield put({
        type: 'update',
        payload: {
          user: null,
          frozen: false,
          isLogin: false,
        },
      });
      throw error;
    },
    *setHeaderBackgroundColor({ payload }, { put }) {
      yield put({
        type: 'update',
        payload: {
          headerBackgroundColor: payload,
        },
      });
    },

    *sendValidateCode({ payload }, { call, put, select }) {
      const { retryAfterSeconds } = select((state) => state.user);
      const { key, ...params } = payload;
      try {
        let api;
        if (key === 'phone') api = sendBindPhoneCode;
        else api = sendValidateCode;
        const { data, success, msg } = yield call(api, params);
        const seconds = data && data.retryAfterSeconds;
        yield put({
          type: 'update',
          payload: { retryAfterSeconds: { ...retryAfterSeconds, [key]: seconds || 60 } },
        });
        if (!success) yield put({ type: 'app/setToast', payload: { message: msg } });
        return success;
      } catch (e) {
        if (e.msg) yield put({ type: 'app/setToast', payload: { message: e.msg } });
        return false;
      }
    },
    *setLocal({ payload: { params, reloadUser = true } }, { call, put }) {
      yield call(userService.setLocal, params);
      if (reloadUser) {
        yield put({ type: 'pullUser' });
      }
    },
    *verifyMailAndBindPhone({ payload }, { call, all, put }) {
      const { emailCode, phone, code, countryCode } = payload;
      const [emailResult, phoneResult] = yield all([
        call(verifyValidateCode, { bizType: 'BIND_PHONE', 'validations[my_email]': emailCode }),
        call(bindPhone, { phone, code, countryCode }),
      ]);
      if (emailResult.success && phoneResult.success) {
        yield put({
          type: 'app/setToast',
          payload: { type: 'info', message: _t('operation.succeed') },
        });
        goBack();
      }
    },
    *pullSecurtyMethods({ payload: { id } = {} }, { call, put }) {
      const res = yield call(pullSecurtyMethods, id);
      yield put({
        type: 'update',
        payload: {
          securtyStatus: res.data,
        },
      });
    },
    *logout({ payload }, { call, put }) {
      const { success } = yield call(userService.logout, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            user: null,
            isLogin: false,
          },
        });
        // 清空邀请码数据
        yield put({
          type: 'kcCommon/update',
          payload: {
            inviteCode: undefined,
          },
        });
      }
    },
    *queryIpDismiss({ payload }, { put, call }) {
      try {
        const { data } = yield call(userService.queryIpDismiss, payload);
        const _forceKycInfo =
          find(data, function (value) {
            return value.dismiss;
          }) || {};
        yield put({ type: 'update', payload: { forceKycInfo: _forceKycInfo } });
        return _forceKycInfo;
      } catch (e) {
        return {};
      }
    },
  },
  subscriptions: {},
});
