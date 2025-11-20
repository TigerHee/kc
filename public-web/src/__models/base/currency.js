/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import polling from 'common/models/polling';
import extend from 'dva-model-extend';
import intl from 'react-intl-universal';
import { getPrices, getRates } from 'services/currency';
import storage from 'utils/storage';
import waitFor from 'utils/waitForSaga';

export default extend(base, polling, {
  namespace: 'currency',
  state: {
    currency: null,
    currencyList: [],
    // map: {}, // deprecated
    // list: [], // deprecated
    rates: {},
    prices: {},
  },
  effects: {
    *pullRates(action, { call, put }) {
      const currencyList = [];
      let rates = {};
      try {
        const { data } = yield call(getRates);
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
    *pullPrices({ payload: { currency } }, { call, put, select }) {
      let nowCurrency = currency;
      if (!currency) {
        const { user } = yield select((state) => state.user);
        const storageCurrency = storage.getItem('currency');
        nowCurrency = storageCurrency && storageCurrency !== 'null' ? storageCurrency : window._DEFAULT_RATE_CURRENCY_;
        if (user && user.currency && user.currency !== 'null') {
          nowCurrency = user.currency;
        } else if (nowCurrency === 'CNY') {
          // 从缓存拿的CNY需要处理成USD
          nowCurrency = window._DEFAULT_RATE_CURRENCY_;
          storage.setItem('currency', window._DEFAULT_RATE_CURRENCY_);
        }
      }
      const { data } = yield call(getPrices, nowCurrency);
      yield put({
        type: 'update',
        payload: {
          currency: nowCurrency,
          prices: data || {},
        },
      });
    },
    *selectCurrency(
      { payload: { currency, reloadUser = true }, logined = false },
      { put, select },
    ) {
      const user = yield select((state) => state.user.user);
      const nowCurrency = currency && currency !== 'null' ? currency : window._DEFAULT_RATE_CURRENCY_;
      if (user || logined) {
        yield put({
          type: 'user/setLocal',
          payload: { params: { currency: nowCurrency }, reloadUser },
        });
      }
      yield put({
        type: 'update',
        payload: { currency: nowCurrency },
      });
      storage.setItem('currency', nowCurrency);
    },
    *watchUser(action, { select, put, take, call }) {
      yield call(waitFor, (state) => !!state.user.user, { select, take });
      const currentLang = intl.options.currentLocale;
      const user = yield select((state) => state.user.user);

      yield put({ type: 'pullPrices', payload: { currency: user.currency } });

      const currency = yield select((state) => state?.currency?.currency);
      const _currency =
        user.currency ||
        currency?.currency ||
        storage.getItem('currency') ||
        storage.getItem('_rl_currency');
      if (_currency) {
        yield put({
          type: 'selectCurrency',
          payload: {
            currency: _currency,
            reloadUser: user.language === currentLang && !user.currency,
          },
          logined: true,
        });
      }
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      setTimeout(() => {
        dispatch({ type: 'watchUser' });
        dispatch({ type: 'pullRates' });
        dispatch({ type: 'pullPrices', payload: {} });
      });
      // @deprecated 未触发
      // dispatch({
      //   type: 'watchPolling',
      //   payload: { effect: 'pullPrices', interval: 2 * 60 * 1000 },
      // });
    },
  },
});
