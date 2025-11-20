/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import { getRates, getPrices } from 'services/currency';
import storage from 'utils/storage';
import { isABNew } from '@/meta/const';

export default extend(base, polling, {
  namespace: 'currency',
  state: {
    currency: null,
    currencyList: [],
    rates: {},
    prices: {},
    pricesUSD: {},
  },
  effects: {
    *pullRates({ payload = {} }, { call, put, select }) {
      const currencyList = [];
      let rates = {};
      try {
        const { data } = yield call(getRates);
        if (data) {
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key) && key !== 'CNY') {
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
          currencyList, // 只在Header中用了
          rates, // 只在小屏下的Header中用了
        },
      });
    },
    *pullPrices({ payload: { currency } }, { call, put, select }) {
      let nowCurrency = currency;
      if (!currency) {
        const user = yield select(state => state.user?.user);
        nowCurrency = storage.getItem('currency') || 'USD';
        if (user && user.currency && user.currency !== 'null') {
          nowCurrency = user.currency;
        } else if (nowCurrency === 'CNY') {
          // 从缓存拿的CNY需要处理成USD
          nowCurrency = 'USD';
          storage.setItem('currency', 'USD');
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
    *pullUSDPrices({ payload }, { call, put, select }) {
      const { data } = yield call(getPrices, 'USD');
      yield put({
        type: 'update',
        payload: {
          pricesUSD: data || {},
        },
      });
    },
    *selectCurrency({ payload: {
      currency, reloadUser = true }, logined = false }, { put, select }) {
      const user = yield select(state => state.user.user);
      if (user || logined) {
        // TODO user setlocal
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
    setUpCurrency({ dispatch }) {
      // FIXME: 移到 RootV4 useInit 请求中，V3 已下线，暂不添加
      // if (!isABNew()) {
      //   dispatch({ type: 'pullRates' });
      // }
      // dispatch({ type: 'pullPrices', payload: {} });
      // @deprecated 未实际触发，注释
      // dispatch({
      //   type: 'watchPolling',
      //   payload: { effect: 'pullPrices', interval: 2 * 60 * 1000 },
      // });
    },
  },
});
