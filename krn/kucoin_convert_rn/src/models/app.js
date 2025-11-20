/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import {baseModel} from 'utils/dva';
import {
  queryUserInfo,
  queryMainAccount,
  queryTradeAccount,
  fetchSmallExchangeConfig,
  getRates,
  getPrices,
  getCompliantRulers,
} from 'services/app';
import {setCsrf} from 'utils/request';
import {getNativeInfo, setNativeInfo} from 'utils/helper';

const getCoinMap = coins => {
  return new Promise(resolve => {
    const temp = {};
    coins.forEach(item => {
      const {currency} = item;
      temp[currency] = {...item};
    });
    resolve(temp);
  });
};

export default extend(baseModel, {
  namespace: 'app',
  state: {
    isLogin: null, // 初始化未发生请求时为null，已登录为true，未登录为false
    userInfo: null,
    nativeInfo: null, // null为未获取到，获取到为object
    networkUnavailable: false, // 网络不可用
    version: '',
    // user account
    main: [],
    trade: [],
    mainMap: {},
    tradeMap: {},
    smallExchangeConfig: {},

    // currency
    currency: null,
    currencyList: [],
    rates: {},
    prices: {},

    fetchStatus: false,

    fromNativeParams: {}, // 通过/krn/router携带进来的query参数
    compliantRuleConfigs: null, // 展业中台配置
  },
  effects: {
    *initApp({payload}, {put}) {
      yield put({type: 'getUser'});
      yield put({type: 'symbols/getCoinsCategory'});
    },
    *getUser({payload}, {put, call}) {
      try {
        const {success, data} = yield call(queryUserInfo);
        if (success && data) {
          data.csrf && setCsrf(data.csrf);
          yield put({type: 'update', payload: {isLogin: true, userInfo: data}});
        } else {
          yield put({type: 'update', payload: {isLogin: false}});
        }
      } catch (e) {
        // user-info接口的http status code非200记录为网络异常
        if (+e?.httpStatus < 200 || +e?.httpStatus >= 300) {
          yield put({type: 'update', payload: {networkUnavailable: true}});
        }
        yield put({type: 'update', payload: {isLogin: false}});
      } finally {
        yield put({type: 'pullRates'});
        yield put({type: 'pullPrices', payload: {}});
      }
    },
    *pullAccountCoins(action, {call, put, all, select}) {
      const {smallExchangeConfig, fetchStatus} = yield select(
        state => state.app,
      );

      if (!smallExchangeConfig || fetchStatus) {
        return;
      }

      yield put({
        type: 'update',
        payload: {
          fetchStatus: true,
        },
      });

      const [{data: main}, {data: trade}] = yield all([
        call(queryMainAccount, 0, smallExchangeConfig.baseCurrency),
        call(queryTradeAccount, 0, smallExchangeConfig.baseCurrency),
      ]);
      const [tradeMap, mainMap] = yield all([
        call(getCoinMap, trade),
        call(getCoinMap, main),
      ]);

      yield put({
        type: 'update',
        payload: {
          main: main || [],
          trade: trade || [],
          tradeMap,
          mainMap,
          fetchStatus: false,
        },
      });
    },

    *getSmallExchangeConfig({payload}, {put, call, select}) {
      try {
        const {smallExchangeConfig} = yield select(state => state.app);
        // 当前运行时如果已经获取过了，就不再获取了
        if (smallExchangeConfig && smallExchangeConfig.baseCurrency) return;
        const {data} = yield call(fetchSmallExchangeConfig, payload);
        yield put({
          type: 'update',
          payload: {
            smallExchangeConfig: data,
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            smallExchangeConfig: {
              baseCurrency: 'USDT',
              quotaLimit: 0,
            },
          },
        });
      }
    },

    *pullRates(action, {call, put}) {
      const currencyList = [];
      let rates = {};
      try {
        const {data} = yield call(getRates);
        if (data) {
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              currencyList.push(key);
            }
          }
          rates = data;
        }
      } catch (e) {
        console.log(e);
      }
      yield put({
        type: 'update',
        payload: {
          currencyList,
          rates,
        },
      });
    },
    *pullPrices({payload: {currency}}, {call, put, select}) {
      let nowCurrency = currency;
      const user = yield select(state => state.app.userInfo);
      if (!currency) {
        const nativeInfo = yield getNativeInfo();
        nowCurrency = nativeInfo.legal || 'USD';
        if (user && user.currency && user.currency !== 'null') {
          nowCurrency = user.currency;
        } else if (nowCurrency === 'CNY') {
          // 从缓存拿的CNY需要处理成USD
          nowCurrency = 'USD';
          yield setNativeInfo({...nativeInfo, legal: nowCurrency});
        }
      }
      yield put({
        type: 'update',
        payload: {
          currency: nowCurrency,
        },
      });

      const {data} = yield call(getPrices, nowCurrency);
      yield put({
        type: 'update',
        payload: {
          prices: data || {},
        },
      });
    },

    // 展业中台配置
    *getCompliantRulers({payload}, {call, put, select}) {
      const {data} = yield call(getCompliantRulers, payload);
      const {config} = data || {};
      const {forbidden_pages, ...rest} = config || {};

      yield put({
        type: 'update',
        payload: {
          compliantRuleConfigs: rest,
        },
      });
    },
  },
  subscriptions: {
    setUp({dispatch}) {
      dispatch({type: 'initApp'});
    },
  },
});
