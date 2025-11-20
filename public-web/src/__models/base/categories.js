/**
 * Owner: willen@kupotech.com
 */
import { delay } from 'utils/delay';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { getCoinsCategory } from 'services/market';
import { maxPrecision } from 'config/base';
import precision from 'utils/precision';
import numberFixed from 'utils/numberFixed';
import createDecimals from 'utils/createDecimals';

export default extend(base, {
  namespace: 'categories',
  state: {},
  reducers: {},
  effects: {
    *pull(action, { call, put }) {
      try {
        const { data } = yield call(getCoinsCategory);
        const map = {};
        const coinNamesMap = {};
        const poolCoinsMap = {};
        const kumexCoinsMap = {};
        const list = [];
        data.pool.forEach((item) => {
          poolCoinsMap[item.currency] = item;
        });
        data.kumex.forEach((item) => {
          kumexCoinsMap[item.currency] = item;
        });
        data.kucoin.forEach((item) => {
          item.precision = parseInt(item.precision || maxPrecision, 10);
          precision(item.coin, item.precision);
          const newItem = {
            ...item,
            key: item.currency,
            coin: item.currency,
            // icon: `${ASSETS_PATH}/${item.currency}.png`,
            step: numberFixed(1 / Math.pow(10, item.precision)),
            decimals: createDecimals(item.precision),
            isContractEnabled: !!kumexCoinsMap[item.currency],
            isPoolEnabled: !!poolCoinsMap[item.currency],
          };
          map[item.currency] = newItem;
          coinNamesMap[item.currencyName] = newItem;
          list.push(newItem);
        });

        yield put({ type: 'reset', payload: map });
        yield put({
          type: 'coins/update',
          payload: {
            list,
            coinNamesMap,
            poolCoinsMap,
            kumexCoinsMap,
            poolCoins: data.pool,
            kumexCoins: data.kumex,
          },
        });
      } catch (e) {
        yield call(delay, 3000);
        yield put({ type: 'pull' });
      }
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      setTimeout(() => {
        dispatch({ type: 'pull' });
      });
    },
  },
});
