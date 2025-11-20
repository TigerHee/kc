/**
 * Owner: borden@kupotech.com
 */
import sentry from '@kc/sentry';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { getFirstBrowserLanguage, searchToJson } from 'helper';
import * as userService from 'services/user';
import { delay } from 'utils/delay';
import storage from 'utils/storage';
import { setCsrf } from 'utils/request';
import memStorage from 'utils/memStorage';
import { determineBasenameFromUrl, getLangFromLocaleMap } from 'utils/lang';
import { getUrlSymbolCode } from 'utils/tools';
import Report from 'utils/report';
import { KcSensorsLogin } from 'utils/kcsensorsConf';
import workerSocket from 'common/utils/socketProcess';
import { KUCOIN_LANG_KEY } from 'src/codes';
import { _IS_TEST_ENV_ } from 'src/utils/env';

const localeBasename = determineBasenameFromUrl();

export default extend(base, {
  namespace: 'user',
  state: {
    frozen: undefined, // undefined表示pullUser未返回
    user: undefined, // undefined表示未从服务器拉取
    isLogin: undefined,
    securtyStatus: {},
    timeZones: [],
    userLocaleInfo: undefined, // undefined表示未从服务器拉取
    balanceCurrency: 'USDT', // 计价单位
    isShowRestrictedUserNotice: false, // 是否显示限制中国大陆用户充值的提示弹窗
    forceKycInfo: {},
    appInfo: {},
  },
  effects: {
    *pullUser({ payload = {} }, { call, put, select }) {
      const app = yield select((state) => state.app);
      const currency = yield select((state) => state.currency);

      let userData = null;
      try {
        const { data } = yield call(userService.pullUserInfo);
        // ip合规语言以CF边缘标识为准
        if (window._BRAND_SITE_ === 'KC') {
          if (!!window.ipRestrictCountry && window.ipRestrictCountry === data?.language) {
            data.language = 'en_US';
          }
        }
        userData = data;
        if (data) {
          // const csrfRes = yield call(userService.pullCsrf);
          setCsrf(data.csrf);
          Systemjs.import('@kucoin-biz/tools').then(({ default: { setCsrf: setRemoteCsrf } }) => {
            setRemoteCsrf(data.csrf);
          });
          yield workerSocket.setCsrf(data.csrf);

          const _currency =
            data.currency ||
            currency.currency ||
            payload.currency ||
            storage.getItem('currency') ||
            storage.getItem('_rl_currency');
          if (_currency) {
            yield put({
              type: 'currency/selectCurrency',
              payload: {
                currency: _currency,
                reloadUser: data.language === app.currentLang && !data.currency,
              },
              logined: true,
            });
          }

          // yield put({ type: 'market/pullDiscountSymbols' });
          yield put({ type: 'homepage/getTradeFee' });
          yield put({
            type: 'currency/pullPrices',
            payload: { currency: data.currency },
          }); // 解决弱网情况下，汇率根据默认值USD查询造成的bug
          yield put({
            type: 'tradeMarkets/pullUserFavSymbols',
            payload: { user: data },
          });
          try {
            sentry.setUser({ id: data.uid });
          } catch (err) {
            console.error(err);
          }
          KcSensorsLogin(String(data.uid), String(data.honorLevel));
          Report.setIDConfig(data.uid);
        }

        const { type: _type = 1, balanceCurrency = 'USDT' } = data || {};
        if (data) data.isSub = _type === 3;
        yield put({
          type: 'update',
          payload: {
            user: data || null,
            isLogin: true,
            frozen: false,
            balanceCurrency:
              balanceCurrency && balanceCurrency !== 'null' ? balanceCurrency : 'USDT',
          },
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

          // 登录成功获取临时令牌
          yield put({ type: 'pullRenewalToken' });
        }

        // connect ws on browser
        yield put({ type: 'app/connectWs' });
      } catch (e) {
          yield put({
            type: 'checkUserError',
            payload: {
              error: e,
            },
          });
      } finally {
        // 无论如何都初始化一种语言，避免页面卡死
        // yield put({ type: 'app/initDefaultLang' });
        let browserLanguage = getFirstBrowserLanguage();
        browserLanguage = browserLanguage.replace('-', '_');

        const query = searchToJson();
        const { language } = userData || {};
        // 语言顺序：用户数据，?lang参数，语言子路径，本地存储
        const langByPath = getLangFromLocaleMap(localeBasename);
        const initedLang = storage.getItem('lang', KUCOIN_LANG_KEY);
        // || (_IS_INSIDE_WEB_ ? 'zh_CN' : browserLanguage); // 国内站构建初始化语言绕开浏览器语言获取逻辑
        let initLang = language || query?.lang;
        if (!initLang) {
          if (langByPath === window._DEFAULT_LANG_ && initedLang) {
            initLang = initedLang;
          } else {
            initLang = langByPath;
          }
        }
        yield put({
          type: 'app/selectLang',
          payload: {
            lang: initLang,
            auser: !!userData,
          },
        });
      }
    },
    *useGetCurrentSymbol({ payload }, { select }) {
      const currentSymbol = yield select(({ trade }) => trade.currentSymbol);
      return (
        payload?.currentSymbol ||
        currentSymbol ||
        storage.getItem('trade_current_symbol') ||
        getUrlSymbolCode() ||
        'BTC-USDT'
      );
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
    *pullSecurtyMethods({ payload: { id } }, { call, put }) {
      const res = yield call(userService.pullSecurtyMethods, id);
      yield put({
        type: 'update',
        payload: {
          securtyStatus: res.data,
        },
      });
    },
    *pullTimeZones({ payload }, { call, put }) {
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
    *pullTimeZone({ payload }, { call, put }) {
      const { data } = yield call(userService.getTimeZone);
      if (data) {
        yield put({
          type: 'update',
          payload: {
            userLocaleInfo: data,
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
    *pullRenewalToken(_, { call }) {
      const { data, success } = yield call(userService.queryRenewalToken);
      if (success) {
        memStorage.setItem('renewalToken', data.t);
      }
    },
    *queryPassiveNotice({ payload }, { put, call }) {
      const { data } = yield call(userService.queryPassiveNotice, payload);
      return data;
    },
    *renewalSession(_, { call, put }) {
      try {
        const { data } = yield call(userService.pullUserInfo);
        const { type: _type = 1, balanceCurrency = 'USDT' } = data || {};
        if (data) {
          data.isSub = _type === 3;
        }
        yield put({
          type: 'update',
          payload: {
            user: data || null,
            isLogin: true,
            frozen: false,
            balanceCurrency:
              balanceCurrency && balanceCurrency !== 'null' ? balanceCurrency : 'USDT',
          },
        });
      } catch (e) {
          yield put({
            type: 'checkUserError',
            payload: {
              error: e,
            },
          });
      }
    },
    *queryKcsEnable({ payload }, { put, call }) {
      const { data } = yield call(userService.queryKcsEnable, payload);
      return data;
    },
  },
});
