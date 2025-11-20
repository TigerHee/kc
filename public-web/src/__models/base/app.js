/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import _ from 'lodash';
// import * as ws from '@kc/socket';
import JsBridge from '@knb/native-bridge';
import base from 'common/models/base';
import { getCountryInfo, getGrowthConfig, getLangList } from 'services/open';
import * as userService from 'services/user';
import compareVersion from 'utils/compareVersion';
import storage from 'utils/storage';
// import { COUNTRY_INFO_KEY } from 'hooks/useCountryInfo';
import sentry from '@kc/sentry';
import { DEFAULT_LANG, SUPPORT_COOKIE_LOGIN } from 'config/base';
import { addLangToPath } from 'tools/i18n';
// 使用新版首页的语言列表, 有all则代表所有语言都支持
// const langlistUseNewIndex = ['all'];
const COUNTRY_INFO_KEY = 'locale_country_info';
export default extend(base, {
  namespace: 'app',
  state: {
    langList: [],
    langListMap: {},
    countryInfo: undefined,
    // app gp下架地区
    illegalGpList: [],
    currentLang: DEFAULT_LANG,
    currentLangReady: false,
    appReady: false,
    isUseNewIndex: true,
    // isSupportNewIndex: true,
    platform: null, // PC, IOS, ANDROID
    from: '',
    toastConfig: {},
    loginOpen: false,
    forgetPwdOpen: false,
    phoneSignUpEnabled: false,
    // 邀请有礼的banner是否展示
    depositBannerShow: false,
    appInfo: {
      darkMode: true,
    }, // app的一些信息
    headerHeight: 0, // header高度
  },
  reducers: {
    langReady(state) {
      return {
        ...state,
        currentLangReady: true,
      };
    },
  },
  effects: {
    *setInit({ payload }, { put }) {
      const { currentLang } = payload;
      // const isSupportNewIndex =
      //   _.indexOf(langlistUseNewIndex, 'all') > -1 ||
      //   _.indexOf(langlistUseNewIndex, 'currentLang') > -1;
      yield put({
        type: 'update',
        payload: {
          currentLang,
        },
      });
    },
    *initApp(_, { put, all }) {
      yield all([put.resolve({ type: 'user/pullUser' }), put.resolve({ type: 'pullLangList' })]);

      yield put({ type: 'update', payload: { appReady: true } });
    },
    *changeUseNewIndexConfig({ payload: { isUseNewIndex } }, { put }) {
      if (typeof isUseNewIndex === 'boolean') {
        yield put({
          type: 'update',
          payload: {
            isUseNewIndex,
          },
        });
        storage.setItem('isUseNewIndex', isUseNewIndex);
      }
    },
    *pullLangList(action, { call, put }) {
      try {
        const { data } = yield call(getLangList);
        if (data) {
          const langListMap = {};
          _.forEach(data, (item) => {
            langListMap[item[0]] = {
              lang: item[0],
              langName: item[1],
            };
          });
          yield put({
            type: 'update',
            payload: {
              langList: data,
              langListMap,
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    *pullCountryInfo({ payload }, { call, put }) {
      try {
        const info = storage.getItem(COUNTRY_INFO_KEY);
        if (info) {
          yield put({ type: 'update', payload: { countryInfo: info } });
          return;
        }

        const { data } = yield call(getCountryInfo);
        yield put({ type: 'update', payload: { countryInfo: data || {} } });
        storage.setItem(COUNTRY_INFO_KEY, data || {});
      } catch (e) {
        console.log('pullCountryInfo error:', e);
        yield put({ type: 'update', payload: { countryInfo: {} } });
      }
    },
    // 解析获得当前GP下架地区列表
    *pullAppGpDownloadConfig({ payload }, { call, put }) {
      try {
        const { data } = yield call(getGrowthConfig, { appId: 'WEB_CONFOG_FOR_APP_DOWNLOAD' });
        const list = _.get(data, 'properties', []).filter(
          (el) => el.property === 'gpAppDownloads' && el.status === 0,
        );
        const str = _.get(list, '0.value', '');
        if (!str) {
          return;
        }
        const records = str.split?.('&&').filter(Boolean);
        yield put({ type: 'update', payload: { illegalGpList: records || [] } });
      } catch (e) {
        console.log('pullAppGpDownloadConfig error:', e);
      }
    },
    *logout({ payload: { to } = {} }, { call }) {
      const { code } = yield call(userService.logout);
      if (code === '200') {
        sentry?.configureScope((scope) => scope?.setUser(null));
        if (to) {
          window.location.href = addLangToPath(`${window.location.origin}${to}`);
        } else {
          window.location.reload();
        }
      }
    },

    // websocket connect
    // *connectWs(action, { select }) {
    //   const socket = ws.getInstance();

    //   const user = yield select((state) => state.user.user);
    //   if (!user) {
    //     // 公有socket，在部分页面不使用
    //     if (!nowPageUseWs()) {
    //       return;
    //     }
    //   }
    //   const { uid = '' } = user || {};
    //   socket.connect({
    //     sessionPrivate: !!user,
    //     uid,
    //   });
    // },

    // run on browser
    *_detectPlatform(action, { put }) {
      const { default: MobileDetect } = yield import('mobile-detect');
      const md = new MobileDetect(window.navigator.userAgent);
      let platform = 'PC';
      if (!md.tablet()) {
        const mobile = md.mobile();
        if (mobile === 'iPhone') {
          platform = 'IOS';
        } else if (mobile) {
          platform = 'ANDROID';
        }
      }

      yield put({
        type: 'update',
        payload: {
          platform,
        },
      });
    },
    *setToast({ payload }, { put }) {
      const _toastConfig = {
        type: 'error', // info,warning,error
        duration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
        open: true,
        ...payload,
      };
      yield put({ type: 'update', payload: { toastConfig: _toastConfig } });
    },

    *getPhoneSignUpEnabled(__, { put, call }) {
      const { data } = yield call(userService.getPhoneSignUpEnabled);
      if (data) {
        yield put({
          type: 'update',
          payload: {
            phoneSignUpEnabled: data.phoneSignUpEnabled,
          },
        });
      }
    },
    *setAppInfo({ payload }, { put }) {
      yield put({
        type: 'update',
        payload: {
          appInfo: payload,
        },
      });
    },
    *setAppVersion({ payload }, { put }) {
      yield put({
        type: 'update',
        payload: {
          appVersion: payload,
        },
      });
    },
    *checkSupportCookieLogin({ payload = {} }, { put }) {
      // 判断当前App版本是否小于给定的App版本
      if (compareVersion(payload, SUPPORT_COOKIE_LOGIN) < 0) {
        yield put({
          type: 'update',
          payload: { supportCookieLogin: false },
        });
      }
    },
  },
  subscriptions: {
    getAppVersion({ dispatch }) {
      JsBridge.open(
        {
          type: 'func',
          params: {
            name: 'getAppVersion',
          },
        },
        function (params) {
          dispatch({
            type: 'setAppVersion',
            payload: params.data,
          });
          dispatch({
            type: 'checkSupportCookieLogin',
            payload: params.data,
          });
        },
      );
    },
    getAppInfo({ dispatch }) {
      JsBridge.open(
        {
          type: 'func',
          params: {
            name: 'getAppInfo',
          },
        },
        function (params) {
          dispatch({
            type: 'setAppInfo',
            payload: params.data,
          });
        },
      );
    },
  },
});
