/**
 * Owner: jesse.shao@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import { getVersion, getUserInfo, getServerTime, getCountry } from 'services/app';
import { setUserCookie, setLocal } from 'services/user';
import { getSMSCountry } from 'services/open';
import { setLang } from 'utils/lang';
import { delay } from 'utils/delay';
import {
  searchToJson,
  compareVersion,
  checkPathname,
  changeLocation,
  deleteLangQuery,
} from 'helper';
import { kucoinStorage } from 'utils/storage';
import JsBridge from 'utils/jsBridge';
import { setCsrf } from 'utils/request';
import Toast from 'components/Toast';
import { helpCenterMain } from 'src/utils/helpCenter';
import { _t, needConfirmLang } from 'utils/lang';
import {
  SUPPORT_COOKIE_LOGIN,
  SUPPORT_KCS_GAME,
  routeFullLanguages,
  _BASE_,
  routeMakeLanguages,
  DEFAULT_LANG as LANG_BY_ROUTE,
  getLocalBase,
  ALL_LANGS,
  RESTRICT_CODE_TO_LANG,
} from 'config';

/**
 * Init lang code
 */
const DEFAULT_LANG = window._DEFAULT_LANG_;

// 各land之间独立，不会有路由跳转，因此直接在页面加载时确定语言范围
let _langs = [
  { key: 'en_US', label: 'English' },
  // { key: 'zh_CN', label: '中文' },
];
if (routeFullLanguages.length && checkPathname(routeFullLanguages)) {
  _langs = ALL_LANGS;
}
// 自定义特定路由语言初始化
const _ex = new RegExp('^' + _BASE_.replace(/\//g, '\\/') + '[/]');
const pathname = `${window.location.pathname}`.replace(_ex, '/');
if (routeMakeLanguages[pathname]) {
  _langs = routeMakeLanguages[pathname];
}
// spolight只有英文
if (pathname.includes('spotlight_r5')) {
  _langs = [{ key: 'en_US', label: 'English' }];
}

const langInQuery = searchToJson()?.lang;

const validLangs = _.map(_langs, ({ key }) => key);
const $initLang = (() => {
  const langInStore = kucoinStorage.getItem('lang');
  // 语言顺序：用户语言，lang参数，语言子路径，storage存储。
  let _lang = langInQuery;
  if (!_lang) {
    if (LANG_BY_ROUTE === window._DEFAULT_LANG_ && langInStore) {
      _lang = langInStore;
    } else {
      _lang = LANG_BY_ROUTE;
    }
  }
  // app进入web界面
  const confirmLang = needConfirmLang();
  if (!confirmLang) {
    _lang = LANG_BY_ROUTE;
  }
  // 关掉浏览器首选语言
  // if (!_lang) {
  //   let browserLang = getFirstBrowserLanguage();
  //   if (browserLang) {
  //     browserLang = browserLang.replace('-', '_');
  //   }
  //   _lang = browserLang;
  // }
  console.log('validLangs~~~~~', validLangs);
  if (_lang && _.indexOf(validLangs, _lang) > -1) {
    return _lang;
  }

  return DEFAULT_LANG;
})();
console.log('$initLang', $initLang);
setLang($initLang, false);
const RtlLangs =  ['ar_AE', 'ur_PK'];// 翻转小语种
/**
 * Base app model
 */
export default extend(base, {
  namespace: 'app',
  state: {
    currentHash: '',
    currentPathname: '',
    langs: _langs,
    currentLang: $initLang, // 初始化语言
    appReady: false,
    appVersion: '', // android 或 ios 版本号
    appInfo: {
      darkMode: true,
    }, // app的一些信息
    isInApp: false,
    statusCode: 404,
    backHome: null,
    supportCookieLogin: true,
    checkSupportKcsGame: true,
    user: {},
    countryCodes: [],
    countryCodesMap: [],
    isRtlLang: RtlLangs.includes($initLang), // 是否是翻转小语种
  },
  reducers: {
    updateHash(state, { payload: { currentHash } }) {
      return {
        ...state,
        currentHash,
      };
    },
  },
  effects: {
    *init(_, { put, take, select }) {
      const isInApp = window.navigator.userAgent.includes('KuCoin');
      yield put({
        type: 'update',
        payload: {
          isInApp,
        },
      });
      // 减少初始化语言次数，在获取用户数据后初始化一次。
      // yield put({ type: 'initLang' });
      // yield take('initLang/@@end');
      const confirmLang = needConfirmLang();
      //不支持的语言
      if (!confirmLang) {
        const { isExist: langByPath = window._DEFAULT_LANG_ } = getLocalBase();
        const { currentLang } = yield select((state) => state.app);
        if (langByPath !== currentLang) {
          yield put({ type: 'selectLang', payload: { lang: currentLang, donotChangeUser: true } });
        }
      }
      yield put({ type: 'initApp' });
      yield put({ type: 'getIpRestrictCountry' });
    },
    *getIpCountry(_, { call }) {
      // 语言地区合规
      if (window.ipRestrictCountry) {
        return window.ipRestrictCountry;
      } else {
        const res = yield call(getCountry);
        if (res.data === null) return null;
        if (res.success && res.data) {
          const { countryCode } = res.data || {};
          const _lang = RESTRICT_CODE_TO_LANG[countryCode];
          if (_lang) return _lang;
        }
      }
    },
    *getIpRestrictCountry(_, { call, select, put }) {
      // 语言合规
      const { currentLang, langs } = yield select(state => state.app) || {};
      let ipRestrictCountry = yield yield put({ type: 'getIpCountry' });
      if (ipRestrictCountry === null) {
        // ip未识别到，也认为是限制国家
        const _lang = Object.values(RESTRICT_CODE_TO_LANG).find(i => i === currentLang);
        if (_lang) ipRestrictCountry = _lang;
      }
      if (!ipRestrictCountry) return;
      yield put({
        type: 'update',
        payload: {
          ipRestrictCountry,
        },
      });
      yield call(delay, 200);
      yield put({
        type: 'update',
        payload: {
          langs: langs.filter(i => i.key !== ipRestrictCountry),
        }
      })
      yield put({
        type: 'selectLang',
        payload: {
          lang: ipRestrictCountry === currentLang ? 'en_US' : currentLang,
        }
      })
    },
    *initApp(action, { put, all }) {
      yield all([
        put.resolve({ type: 'user/pullUser' }),
        put.resolve({ type: 'pullLangList' }),
        put.resolve({ type: 'components/fetch', payload: { pathname: '*' } }),
      ]);

      yield put({ type: 'update', payload: { appReady: true } });
      // yield put({ type: 'getUserInfo' });
    },
    *checkVersion(_, { call, select }) {
      try {
        const res = yield call(getVersion);
        const { release } = res || {};

        console.info('checkVersion:release,_RELEASE_', release, _RELEASE_);

        if (release && release !== _RELEASE_) {
          const appVersion = yield select((state) => state.app.appVersion);
          console.log('Current Release:', _RELEASE_);
          console.log('New Release:', release);
          console.log('Try to refresh new release website');
          const [packageName, version] = release?.split?.('_') || [];

          if (JsBridge.isApp()) {
            JsBridge.open(
              {
                type: 'func',
                params: {
                  name: 'updatePackageVersion',
                  version,
                  packageName,
                },
              },
              (e) => {
                console.log('open app func  fail', e);
              },
            );
          }

          // sentry.captureEvent({
          //   message: `landingweb checkversion-failed:new_${release},old_${_RELEASE_},appVersion_${appVersion}`,
          //   tags: { checkversionFailed: 'failed', errorType: 'version_unique' },
          //   level: 'info',
          //   fingerprint: `版本不一致异常: new release:${release}`, // 设置指纹 相同指纹的异常归为同一个异常
          // });

          //window.location.reload(true);
        }
      } catch (e) {}
    },
    *initLang({ payload: { lang, reload = false } = {} }, { call, select, put }) {
      // const { isExist: langByPath = 'en_US' } = getLocalBase();
      // const storageLang = kucoinStorage.getItem('lang');
      // lang = lang || storageLang || langByPath;
      // if (_.indexOf(validLangs, lang) === -1) {
      //   lang = DEFAULT_LANG;
      // }
      // const user = yield select(state => state.user.user);
      // if (user) {
      //   lang = user.language;
      //   if (_.indexOf(validLangs, lang) === -1) {
      //     lang = DEFAULT_LANG;
      //   }
      //   yield call(setLocal, { language: lang });
      // }
      // setLang(lang, reload);
      // storage.setItem('lang', lang, KUCOIN_LANG_KEY);
      // yield put({
      //   type: 'update',
      //   payload: {
      //     currentLang: lang,
      //   },
      // });
      // // 更改语言后拉取cms组件
      // yield put({ type: 'components/fetch', payload: { pathname: '*' } });
    },
    *selectLang(
      { payload: { lang, auser = null, reload = false, donotChangeUser = false } = {} },
      { call, select, put },
    ) {
      const user = yield select((state) => state.user.user);
      lang = lang || user?.language || $initLang;
      if (_.indexOf(validLangs, lang) === -1) {
        lang = DEFAULT_LANG;
        donotChangeUser = true;
      }
      if ((user || auser) && lang !== user?.language && !donotChangeUser) {
        yield call(setLocal, { language: lang });
      }
      yield call(setUserCookie, { lang }); // TODO 这个方法没有调用
      // realLoad false
      setLang(lang, false);
      kucoinStorage.setItem('lang', lang);
      // if (reload) {
      //   console.log('reload to refresh lang');
      //   // 如果页面query参数含有lang，则还需更新此参数
      //   const params = searchToJson();
      //   if (params.lang && params.lang !== lang) {
      //     const newHref = replaceSearch(window.location.href, 'lang', lang);
      //     window.location.href = newHref;
      //   } else {
      //     // 否则直接刷新页面
      //     window.location.reload(true);
      //   }
      // }

      yield put({
        type: 'update',
        payload: {
          currentLang: lang,
          isRtlLang: RtlLangs.includes(lang),
        },
      });
      // 更改语言后拉取cms组件
      yield put({ type: 'components/fetch', payload: { pathname: '*' } });
      // 保持原有的逻辑，增加路径修改
      const { isExist: langByPath = window._DEFAULT_LANG_ } = getLocalBase();
      if (langByPath !== lang) {
        changeLocation(lang);
      } else {
        // 删除语言参数
        let _href = window.location.href;
        if (_href.endsWith('/')) {
          _href = _href.substring(0, _href.length - 1);
        }
        const _url = deleteLangQuery(_href);
        if (_url !== _href) {
          window.location.replace(_url);
        }
      }
    },
    *getUserInfo({ payload = {} }, { select, call, put }) {
      const userLogin = yield select((state) => state.showcase.userLogin);
      const { data } = yield call(getUserInfo);
      if (!data) {
        if (userLogin) {
          Toast({
            type: 'error',
            msg: _t('choice.user.get.failed')
          });
        }
        return;
      }
      setCsrf(data.csrf);
      const confirmlang = needConfirmLang();
      if (confirmlang) {
        yield put({ type: 'selectLang', payload: { lang: data.language } });
      }
      yield put({
        type: 'update',
        payload: { user: data },
      });
      return true;
    },
    *setAppVersion({ payload }, { put }) {
      yield put({
        type: 'update',
        payload: {
          appVersion: payload,
        },
      });
    },
    *setAppInfo({ payload }, { put }) {
      yield put({
        type: 'update',
        payload: {
          appInfo: payload,
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
    *checkSupportKcsGame({ payload = {} }, { put }) {
      // 判断当前App版本是否小于给定的App版本
      if (compareVersion(payload, SUPPORT_KCS_GAME) < 0) {
        yield put({ type: 'update', payload: { checkSupportKcsGame: false } });
      }
    },
    *openZendesk(__, { select }) {
      const { user } = yield select((state) => state.user);
      const { currentLang } = yield select((state) => state.app);
      const { uid } = user || {};
      const { zE } = window;
      if (!zE || typeof zE.activate !== 'function') {
        if (currentLang === 'zh_CN') {
          window.location.href = helpCenterMain();
        } else {
          window.location.href = helpCenterMain();
        }
      } else {
        zE.activate();
        if (uid) {
          zE('webWidget', 'identify', {
            name: `UID: ${uid}`,
          });
        }
      }
    },
    *getServerTime(_, { put, call }) {
      const { data } = yield call(getServerTime);
      yield put({
        type: 'update',
        payload: {
          serverTime: data,
        },
      });
      return data
    },
    *getSMSCountry(__, { put, call }) {
      const { data } = yield call(getSMSCountry);
      const countryCodesMap = {};
      _.each(data, (item) => {
        countryCodesMap[item.code] = item;
      });
      yield put({
        type: 'update',
        payload: {
          countryCodesMap,
          countryCodes: data,
        },
      });
    },
  },
  subscriptions: {
    /**
     * fix hash change caused by replaceState
     * @param {*} param0
     */
    watchScroll({ dispatch }) {
      const { history } = window;

      const dispatchHash = () => {
        dispatch({
          type: 'updateHash',
          payload: { currentHash: window.location.hash },
        });
      };

      const _wr = (type) => {
        const orig = history[type];
        return function () {
          const rv = orig.apply(this, arguments);
          const e = new Event(type);
          e.arguments = arguments;
          window.dispatchEvent(e);
          return rv;
        };
      };
      history.pushState = _wr('pushState');
      history.replaceState = _wr('replaceState');

      window.addEventListener('replaceState', function (e) {
        console.log('THEY DID IT AGAIN! replaceState');
        // console.log(window.location.hash);
        dispatchHash();
      });
      window.addEventListener('pushState', function (e) {
        console.log('THEY DID IT AGAIN! pushState');
        // console.log(window.location.hash);
        dispatchHash();
      });
      dispatchHash();
    },
    setup({ history, dispatch }) {
      history.listen(({ hash, pathname }) => {
        dispatch({
          type: 'update',
          payload: { currentHash: hash, currentPathname: pathname },
        });
      });

      dispatch({ type: 'init' });
    },
    checkVersion({ dispatch }) {
      console.log('checkVersion1');
      if (!_DEV_) {
        dispatch({
          type: 'checkVersion',
        });
      }
    },
    getAppVersion({ dispatch }) {
      if (!JsBridge.isApp()) return;
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
            type: 'showcase/needDrawerLogin',
            payload: params.data,
          });
          dispatch({
            type: 'checkSupportCookieLogin',
            payload: params.data,
          });
          dispatch({
            type: 'checkSupportKcsGame',
            payload: params.data,
          });
        },
      );
    },
    getAppInfo({ dispatch }) {
      if (!JsBridge.isApp()) return;
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
