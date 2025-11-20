/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { getLangList } from 'services/open';
import * as userService from 'services/user';
import { getVersion } from 'services/app';
import { isNeedToPayTax, queryTaxTips } from 'services/markets';
import storage from 'utils/storage';
import { DEFAULT_LANG, UTM_SOURCES, RCODE, siteCfg } from 'config';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { searchToJson } from 'helper';
import { pathToRegexp } from 'path-to-regexp';
import workerSocket from 'common/utils/socketProcess';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import {
  determineBasenameFromUrl,
  getLangFromLocaleMap,
  getLocaleFromLocaleMap,
  initLocale,
  languages,
  replaceUrlWithoutLang,
} from 'utils/lang';
import { KUCOIN_LANG_KEY } from 'src/codes';
import { APMSWCONSTANTS } from 'utils/apm/apmConstants';
import { isABNew } from '@/meta/const';

const localeBasename = determineBasenameFromUrl();
const defaultLang = getLangFromLocaleMap(localeBasename);
let timer;

export default extend(base, {
  namespace: 'app',
  state: {
    langList: [],
    langListMap: {},
    currentLang: defaultLang,
    currentLangReady: false,
    platform: null, // PC, IOS, ANDROID
    open: false,
    showForgetPwd: false,
    inLg: true, // > 1350 专用
    complianceTaxInfo: {},
    complianceTaxText: '',
  },
  reducers: {
    langReady(state, { payload: { currentLang } }) {
      return {
        ...state,
        currentLang,
        currentLangReady: true,
      };
    },
  },
  effects: {
    *pullLangList({ payload }, { call, put }) {
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
              langListMap,
              langList: data,
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    *isNeedToPayTax({ payload }, { call, put }) {
      try {
        const { data } = yield call(isNeedToPayTax);
        if (data) {
          yield put({
            type: 'update',
            payload: {
              complianceTaxInfo: data,
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    *queryTaxTips({ payload }, { call, put }) {
      try {
        const { data } = yield call(queryTaxTips, payload);
        if (data) {
          yield put({
            type: 'update',
            payload: {
              complianceTaxText: data,
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    *selectLang({ payload: { lang, auser = null } }, { call, select, put }) {
      let nextLang = lang;
      // 不支持的语言设置为英文，下掉简体中文
      let donotChangeUser = false;
      if (languages.indexOf(nextLang) < 0) {
        nextLang = DEFAULT_LANG;
        donotChangeUser = true;
      }
      let nextLocale = getLocaleFromLocaleMap(nextLang);
      const user = yield select((state) => state.user.user);
      if ((user || auser) && nextLang !== user?.language && !donotChangeUser) {
        yield call(userService.setLocal, { language: nextLang });
      }
      yield call(userService.setUserCookie, { lang: nextLang });
      storage.setItem('lang', nextLang, KUCOIN_LANG_KEY);
      yield put({ type: 'update', payload: { currentLang: nextLang } });
      // 判断 localeBasename
      if (localeBasename) {
        // 如果 localeBasename 和设置语言不相同，replace pathname
        if (defaultLang !== nextLang) {
          const nameWidthSlash = `/${nextLocale}`;
          // safari浏览器不支持 ?<=
          const href = window.location.href.replace(
            new RegExp(`${window.location.origin}/${localeBasename}`),
            `${window.location.origin}${nextLocale === window._DEFAULT_LOCALE_ ? '' : nameWidthSlash}`,
          );
          replaceUrlWithoutLang(href, true);
        } else {
          replaceUrlWithoutLang();
        }
      } else {
        const pathRe = pathToRegexp('/trade(.*)?');
        const execResult = pathRe.exec(window.location.pathname);
        if (execResult && nextLocale === window._DEFAULT_LOCALE_) {
          replaceUrlWithoutLang();
          return;
        }
        if (nextLocale === window._DEFAULT_LOCALE_) {
          nextLocale = '';
        }
        if (!execResult) {
          nextLocale = `${nextLocale}${nextLocale ? '/' : ''}trade`;
        }
        const locationOrigin = window.location.origin;
        // 如果 localeBasename 不存在，向当前路径添加一个语言前缀
        const href = window.location.href.replace(
          locationOrigin,
          `${locationOrigin}${nextLocale ? '/' : ''}${nextLocale}`,
        );
        replaceUrlWithoutLang(href, true);
      }
    },

    *logout({ payload: { to } = {} }, { call }) {
      const { code } = yield call(userService.logout);
      if (code === '200') {
        if (to) {
          window.location.href = `${window.location.origin}${to}`;
        } else {
          window.location.reload();
        }
      }
    },

    // websocket connect
    *connectWs({ payload = {} }, { select }) {
      const user = yield select((state) => state.user?.user);

      const { uid, csrf } = user || {};
      const host =
        process.env.NODE_ENV === 'development'
          ? `${window.location.origin}${siteCfg['API_HOST.WEB']}`
          : `${siteCfg.MAIN_HOST}${siteCfg['API_HOST.WEB']}`;
      workerSocket.connect({
        csrf,
        uid,
        host,
      });
      futuresWorkerSocket.connect({
        csrf,
        uid,
        host,
      });
    },

    *clearSessionData({ payload = {} }, { put }) {
      yield put({
        type: 'user/update',
        payload: {
          isLogin: false,
          user: null,
        },
      });
      // reconnect ws on browser
      yield put({ type: 'connectWs' });
    },

    // run on browser
    // *_detectPlatform({ payload }, { put }) {
    //   const MobileDetect = require('mobile-detect');
    //   const md = new MobileDetect(window.navigator.userAgent);
    //   let platform = 'PC';
    //   if (!md.tablet()) {
    //     const mobile = md.mobile();
    //     if (mobile === 'iPhone') {
    //       platform = 'IOS';
    //     } else if (mobile) {
    //       platform = 'ANDROID';
    //     }
    //   }

    //   yield put({
    //     type: 'update',
    //     payload: {
    //       platform,
    //     },
    //   });
    // },

    *_detectUtmSource({ payload }) {
      // 增加渠道标识
      const { hash } = window.location;
      const rcode = queryPersistence.getPersistenceQuery('rcode');
      const utm_source = queryPersistence.getPersistenceQuery('utm_source');
      const utm_campaign = queryPersistence.getPersistenceQuery('utm_campaign');
      const utm_medium = queryPersistence.getPersistenceQuery('utm_medium');
      const searchQuery = {
        rcode,
        utm_source,
        utm_campaign,
        utm_medium,
      };
      // abc=abc 是为了兼容无hash 的情况
      const hashQuery = searchToJson((hash || '').split('?')[1] || 'abc=abc');
      const queryAll = { ...hashQuery, ...searchQuery };
      const utmExist = _.some(UTM_SOURCES, (v) => queryAll[v]);
      _.forEach([...UTM_SOURCES, RCODE], (v) => {
        const res = queryAll[v];
        // utm有参数，但不全的时候，清除此次没有的参数
        if (!res && res !== RCODE && storage.getItem(v) && utmExist) {
          storage.removeItem(v);
        } else if (queryAll[v]) {
          storage.setItem(v, queryAll[v]);
        }
      });
      // 兼容v1 邀请注册
      if (hashQuery.r) {
        storage.setItem('rcode', hashQuery.r);
      }
    },

    *checkVersion({ payload }, { call }) {
      const {
        data: { release },
      } = yield call(getVersion);

      if (release && release !== _RELEASE_) {
        console.log('Current Release:', _RELEASE_);
        console.log('New Release:', release);
        console.log('Try to refresh new release website');
        window.location.reload(true);
      }
    },
    // 上报神策ws数据
    *sendSensorApm({ payload }, { select }) {
      try {
        const swFrequency = yield select((state) => state.collectionSensorsStore.swFrequency);
        const propertiesList = Object.keys(swFrequency) || [];
        const promiseAll = [];
        const promiseList = propertiesList.map((propertyKey, index) => {
          const properties = swFrequency[propertyKey];
          const promiseProperty = new Promise((resolve, reject) => {
            if (!propertiesList.length) {
              resolve({
                10000: 'sendSensorApm-send-error:has no data collect',
                done: true,
              });
            }
            if (window.$KcSensors) {
              window.$KcSensors.track(properties?.event_name, properties, () => {
                resolve({
                  0: 'sendSensorApm-send-success',
                  done: true,
                });
              });
            } else {
              resolve({
                10000: 'sendSensorApm-send-error',
                done: true,
              });
            }
          });
          promiseAll.push(promiseProperty);
          return promiseAll;
        });
        Promise.all(promiseList).then((result) => {
          payload.dispatch({
            type: 'collectionSensorsStore/clearSwFrequency',
          });
        });
      } catch (e) {
        console.log(e, 'sendSensorApm-error');
      }
    },
    *clearSensorApm({ payload }, { put }) {
      yield put({
        type: 'collectionSensorsStore/clearSwFrequency',
      });
    },
  },
  subscriptions: {
    checkVersion({ history, dispatch }) {
      if (_PRD_) {
        history.listen(() => {
          dispatch({
            type: 'checkVersion',
          });
        });
      }
    },
    setUpApp({ dispatch }) {
      initLocale(defaultLang).then(() => {
        dispatch({
          type: 'update',
          payload: {
            currentLangReady: true,
          },
        });
      });
      // FIXME: ab 应该不会走旧逻辑了，先屏蔽
      // if (!isABNew()) {
      //   dispatch({ type: 'pullLangList' });
      // }
      dispatch({ type: '_detectUtmSource' });
      // dispatch({ type: '_detectPlatform' });

      // connect ws on browser
      // dispatch({ type: 'connectWs' });
    },
    setup({ dispatch }) {
      // owen add timer for ws sensor schedule
      try {
        timer = setInterval(() => {
          dispatch({
            type: 'sendSensorApm',
            payload: { dispatch },
          });
        }, APMSWCONSTANTS.SCHEDULE_TIME);
      } catch (error) {
        console.error('setup-schedule-sendSensorApm-error', error);
      }
    },
  },
  unmount() {
    clearInterval(timer);
    timer = null;
  },
});
