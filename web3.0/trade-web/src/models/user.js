/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Jessie
 * @Date: 2019-07-08 11:29:12
 * @Description: ''
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { delay } from 'utils/delay';
import * as userService from 'services/user';
import {
  updateUserKlineConf,
  getUserKlineConf,
  CommonConfSymbol,
  getUserQuickOrderConf,
  updateUserQuickOrderConf,
} from 'services/klineConf';
import storage from 'utils/storage';
import find from 'lodash/find';
import { getFirstBrowserLanguage, searchToJson } from 'helper';
import { setCsrf } from 'utils/request';
import memStorage from 'utils/memStorage';
import { determineBasenameFromUrl, getLangFromLocaleMap } from 'utils/lang';
import { getUrlSymbolCode } from 'utils/tools';
import workerSocket from 'common/utils/socketProcess';
import Report from 'utils/report';
import { KcSensorsLogin } from 'utils/kcsensorsConf';
import { KUCOIN_LANG_KEY } from 'src/codes';
import sentry from '@kc/sentry';
import { _IS_TEST_ENV_ } from 'src/utils/env';

let retryCounter = 5;
const retryExcludesCodes = ['401', '4111', '4113'];
const localeBasename = determineBasenameFromUrl();

const KlineConfInitData = {
  symbol: {},
  common: {},
  saved: {}, // 第一次请求时判断是否和当前值一致
  inUse: false, // 是否使用K线配置，默认不使用
};

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
    klineConf: {
      // K线配置信息，只拉去第一次，并不会同步所有后续的更改
      hasFetch: false,
      ...KlineConfInitData,
    },
    quickOrder: {
      // 快速下单
      visible: false,
      ...storage.getItem('quickOrder'),
    },
    forceKycInfo: {},
  },
  reducers: {
    // 重置 klineConf state
    resetKline(state, { payload }) {
      return {
        ...state,
        klineConf: {
          ...state.klineConf,
          ...KlineConfInitData,
          ...payload,
        },
      };
    },
  },
  effects: {
    *pullUser({ payload = {} }, { call, put, select }) {
      const app = yield select((state) => state.app);
      const currency = yield select((state) => state.currency);

      let userData = null;
      try {
        const { data } = yield call(userService.pullUserInfo);
        userData = data;

        if (data) {
          // const csrfRes = yield call(userService.pullCsrf);
          setCsrf(data.csrf);
          // Systemjs.import('@kucoin-biz/tools').then(({ default: { setCsrf: setRemoteCsrf } }) => {
          //   setRemoteCsrf(data.csrf);
          // });
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
          yield put({ type: 'pullKlineConf', payload: { user: data } });
          yield put({ type: 'pullQuickOrderConf', payload: { user: data } });

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
        // 触发相关的获取
        yield put({
          type: 'afterUserPulled',
          payload: {
            user: data || null,
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

        retryCounter = 5;
      } catch (e) {
        if (e && !retryExcludesCodes.includes(e.code) && retryCounter > 0) {
          yield delay(5000);
          retryCounter -= 1;
          // console.log('asasasasas', e);
          yield put({ type: 'pullUser' });
        } else {
          yield put({
            type: 'checkUserError',
            payload: {
              error: e,
            },
          });
        }
      } finally {
        // 无论如何都初始化一种语言，避免页面卡死
        // yield put({ type: 'app/initDefaultLang' });
        let browserLanguage = getFirstBrowserLanguage();
        browserLanguage = browserLanguage.replace('-', '_');

        const query = searchToJson();
        const { language } = userData || {};
        // 语言顺序：用户数据，?lang参数，语言子路径，本地存储
        const langByPath = getLangFromLocaleMap(localeBasename);
        const currentApp = yield select((state) => state.app);
        const initedLang = storage.getItem('lang', KUCOIN_LANG_KEY);
        // || (_IS_INSIDE_WEB_ ? 'zh_CN' : browserLanguage); // 国内站构建初始化语言绕开浏览器语言获取逻辑
        let initLang = language || query?.lang;
        if (!initLang) {
          if (langByPath === 'en_US' && initedLang) {
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
    *getCurrentSymbol({ payload }, { select }) {
      const currentSymbol = yield select(({ trade }) => trade.currentSymbol);
      return (
        payload?.currentSymbol ||
        currentSymbol ||
        storage.getItem('trade_current_symbol') ||
        getUrlSymbolCode() ||
        'BTC-USDT'
      );
    },
    // 获取K线交易对相关的配置
    *pullKlineSymbolConf({ payload: { symbol: symbolVal } }, { call, put, select }) {
      try {
        const [user, klineConf] = yield select(({ user: userModel }) => [
          userModel.user,
          userModel.klineConf,
        ]);
        const symbolCode = symbolVal || (yield put.resolve({ type: 'getCurrentSymbol' }));
        if (!klineConf.hasFetch || !user || !klineConf.inUse) return;
        // 发起请求
        const { items, inUse = KlineConfInitData.inUse } = yield call(getUserKlineConf, {
          symbol: [symbolCode],
          userid: user.uid,
        });
        if (!inUse) {
          yield put({
            type: 'resetKline',
            payload: {
              inUse,
            },
          });
          return;
        }
        const res = {};
        (items || []).forEach(({ symbol, pri_data_value, pri_dict_value }) => {
          if (!res[symbol]) {
            res[symbol] = {};
          }
          res[symbol][pri_dict_value] = pri_data_value ? JSON.parse(pri_data_value) : undefined;
        });
        yield put({
          type: 'update',
          payload: {
            klineConf: {
              ...klineConf,
              inUse,
              symbol: {
                ...klineConf.symbol,
                ...res,
              },
            },
          },
        });
      } catch (error) {
        if (_DEV_ || _IS_TEST_ENV_) {
          console.error(error);
        }
      }
    },
    // 获取K线配置全部配置（拿到user后执行）
    *pullKlineConf({ payload = {} }, { call, put, select }) {
      try {
        const { user } = payload;
        const symbolCode = yield put.resolve({ type: 'getCurrentSymbol' });
        const { items, inUse = KlineConfInitData.inUse } = yield call(getUserKlineConf, {
          symbol: [CommonConfSymbol, symbolCode],
          userid: user.uid,
        });
        if (!inUse) {
          return;
        }
        const res = {
          common: {},
          symbol: {},
        };
        (items || []).forEach(({ symbol, pri_data_value, pri_dict_value }) => {
          const val = pri_data_value ? JSON.parse(pri_data_value) : undefined;
          if (symbol === CommonConfSymbol) {
            res.common[pri_dict_value] = val;
          } else {
            if (!res.symbol[symbol]) {
              res.symbol[symbol] = {};
            }
            res.symbol[symbol][pri_dict_value] = val;
          }
        });
        const klineConf = yield select((state) => state.user.klineConf);
        yield put({
          type: 'update',
          payload: {
            klineConf: {
              ...klineConf,
              ...res,
              inUse,
              hasFetch: true,
            },
          },
        });
      } catch (error) {
        if (_DEV_ || _IS_TEST_ENV_) {
          console.error(error);
        }
      }
    },
    // 更新K线配置
    *updateKlineConf({ payload: { type, ...params } = {} }, { call, select, put }) {
      try {
        const [user, klineConf] = yield select((state) => [state.user.user, state.user.klineConf]);
        if (!user || !klineConf.inUse) return;
        const keys = Object.keys(params);
        const isSymbolConf = type === 'symbol';
        if (keys.length === 1) {
          const pri_dict_value = keys[0];
          const pri_data_value = JSON.stringify(params[keys[0]]);
          const isFirstSave = !klineConf.saved?.[pri_dict_value];
          const isSame =
            isFirstSave &&
            pri_data_value === klineConf[isSymbolConf ? 'symbol' : 'common']?.[pri_dict_value];
          // 没发生更新，避免第一次还原
          if (isFirstSave) {
            yield put({
              type: 'update',
              payload: {
                klineConf: {
                  ...klineConf,
                  saved: {
                    ...klineConf.saved,
                    [pri_dict_value]: true,
                  },
                },
              },
            });
          }
          if (isSame) {
            return;
          }
          params = {
            pri_dict_value,
            pri_data_value,
          };
        }
        params.userid = user.uid;
        // 与币对相关的配置
        if (isSymbolConf) {
          const symbol = yield put.resolve({ type: 'getCurrentSymbol' });
          yield call(updateUserKlineConf, {
            ...params,
            symbol,
          });
        } else {
          // 通用配置
          yield call(updateUserKlineConf, params);
        }
      } catch (error) {
        if (_DEV_ || _IS_TEST_ENV_) {
          console.error(error);
        }
      }
    },
    // 获取快速下单配置（拿到user后执行）
    *pullQuickOrderConf({ payload = {} }, { call, put, select }) {
      try {
        const { user } = payload;
        const { items } = yield call(getUserQuickOrderConf, {
          userid: user.uid,
        });
        const res = {};
        (items || []).forEach(({ pri_data_value, pri_dict_value }) => {
          // 默认 true
          const val = pri_data_value ? JSON.parse(pri_data_value) : undefined;
          res[pri_dict_value] = val;
        });
        const quickOrder = yield select((state) => state.user.quickOrder);
        yield put({
          type: 'update',
          payload: {
            quickOrder: {
              ...quickOrder,
              visible: true,
              ...res,
            },
          },
        });
      } catch (error) {
        if (_DEV_ || _IS_TEST_ENV_) {
          console.error(error);
        }
      }
    },
    // 更新快速下单配置
    *updateQuickOrderConf({ payload: { ...params } = {} }, { call, select, put }) {
      try {
        const [user, quickOrder] = yield select((state) => [
          state.user.user,
          state.user.quickOrder,
        ]);
        storage.setItem('quickOrder', params);
        if (!user) {
          yield put({
            type: 'update',
            payload: {
              quickOrder: {
                ...quickOrder,
                ...params,
              },
            },
          });
          return;
        }
        const confParams = Object.entries(params).reduce((res, [key, value]) => {
          Object.assign(res, {
            pri_dict_value: key,
            pri_data_value: JSON.stringify(value),
          });
          return res;
        }, {});
        confParams.userid = user.uid;
        yield call(updateUserQuickOrderConf, confParams);
        yield put({
          type: 'update',
          payload: {
            quickOrder: {
              ...quickOrder,
              ...params,
            },
          },
        });
      } catch (error) {
        if (_DEV_ || _IS_TEST_ENV_) {
          console.error(error);
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

    // 收集其他model 或effect 需要在user 确定之后触发的
    *afterUserPulled({ payload }, { put }) {
      const { user } = payload;
      // 登录都需要触发的
      yield put({
        type: 'user_assets/initAfterUser',
        payload: {
          user,
        },
      });
      // 只有登录才能触发的
      if (user) {
        yield put({ type: 'bonus/pullMarginBonusStatus' });
        // 拉取杠杆白名单配置，已经请求成功过的话会被阻断，不会重复请求
        yield put({ type: 'marginMeta/pullConfigsByUser' });
        yield put({ type: 'symbols/pullIsolatedSymbolsByUser' });
      }
    },
    *queryIpDismiss({ payload }, { put, call }) {
      try {
        const { data } = yield call(userService.queryIpDismiss, payload);
        const _forceKycInfo =
          find(data, (value) => {
            return value.dismiss;
          }) || {};
        yield put({ type: 'update', payload: { forceKycInfo: _forceKycInfo } });
        return _forceKycInfo;
      } catch (e) {
        return {};
      }
    },
    *queryPassiveNotice({ payload }, { put, call }) {
      const { data } = yield call(userService.queryPassiveNotice, payload);
      return data;
    },
    *queryKcsEnable({ payload }, { put, call }) {
      const { data } = yield call(userService.queryKcsEnable, payload);
      return data;
    },
  },
  subscriptions: {
    // setUpUser({ dispatch }) {
    //   dispatch({ type: 'pullUser', payload: { firstCall: true } });
    //   // timezone 未使用
    //   // dispatch({ type: 'pullTimeZone' });
    // },
    klineConf({ dispatch, history }) {
      history.listen(() => {
        dispatch({
          type: 'pullKlineSymbolConf',
          payload: {
            symbol: String(history.location.pathname).slice(1),
          },
        });
      });
    },
  },
});
