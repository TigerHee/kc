/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import polling from 'utils/common_models/polling';
import { getRates, getPrices } from 'services/currency';
import { searchToJson } from 'helper';
import storage from 'utils/storage';

export default extend(base, polling, {
  namespace: 'currency',
  state: {
    currency: null,
    currencyList: [],
    rates: {},
    prices: {},
  },
  effects: {
    *pullRates({ payload = {} }, { call, put, select }) {
      const { user } = yield select((state) => state.user);
      const query = searchToJson(); // 使用链接中的currency
      let currency = query.currency || storage.getItem('currency') || window._DEFAULT_RATE_CURRENCY_;
      if (user) {
        currency = user.currency;
      } else if (currency === 'CNY') {
        // 从缓存拿的CNY需要处理成USD
        currency = window._DEFAULT_RATE_CURRENCY_;
        storage.setItem('currency', window._DEFAULT_RATE_CURRENCY_);
      }
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
          currency,
          currencyList,
          rates,
        },
      });
    },
    *pullPrices({ payload: { currency } }, { call, put, select }) {
      let nowCurrency = currency;
      if (!currency) {
        const { user } = yield select((state) => state.user);
        nowCurrency = storage.getItem('currency') || window._DEFAULT_RATE_CURRENCY_;
        if (user && user.currency && user.currency !== 'null') {
          nowCurrency = user.currency;
        }
      }
      const { data } = yield call(getPrices, nowCurrency);
      yield put({
        type: 'update',
        payload: { prices: data || {} },
      });
    },
    *selectCurrency(
      { payload: { currency, reloadUser = true }, logined = false },
      { put, select },
    ) {
      const user = yield select((state) => state.user.user);
      if (user || logined) {
        yield put({
          type: 'user/setLocal',
          payload: { params: { currency }, reloadUser },
        });
      }
      yield put({
        type: 'update',
        payload: { currency },
      });
      storage.setItem('currency', currency);
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({ type: 'pullRates' });
      dispatch({ type: 'pullPrices', payload: {} });
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullPrices', interval: 2 * 60 * 1000 },
      });
    },
  },
});
