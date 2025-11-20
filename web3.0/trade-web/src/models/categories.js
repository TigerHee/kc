/**
 * Owner: borden@kupotech.com
 */
import { delay } from 'utils/delay';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { getCoinsCategory } from 'services/markets';
import { maxPrecision } from 'config';
import { numberFixed, createDecimals } from 'helper';

export default extend(base, {
  namespace: 'categories',
  state: {},
  reducers: {},
  effects: {
    *pull({ payload = {} }, { call, put }) {
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
        // const getStepFromCache = cacheStep();

        data.kucoin.forEach((item) => {
          item.precision = parseInt(item.precision || maxPrecision, 10);
          // const newItem = {
          //   ...item,
          //   key: item.currency,
          //   coin: item.currency,
          //   // icon: `${ASSETS_PATH}/${item.currency}.png`,
          //   step: numberFixed(1 / Math.pow(10, item.precision)),
          //   decimals: createDecimals(item.precision),
          //   isContractEnabled: !!kumexCoinsMap[item.currency],
          //   // isPoolEnabled: !!poolCoinsMap[item.currency],
          // };
          // 这里不需要解构，原数据无其他使用
          item.key = item.currency;
          item.coin = item.currency;
          item.step = numberFixed(1 / Math.pow(10, item.precision));
          item.decimals = createDecimals(item.precision);
          item.isContractEnabled = !!kumexCoinsMap[item.currency];
          item.isPoolEnabled = !!poolCoinsMap[item.currency];
          // 同样的数据为啥需要重新保存一份？？
          map[item.currency] = item;
          coinNamesMap[item.currencyName] = item;
          list.push(item);
        });
        yield put({ type: 'reset', payload: map });
        yield put({
          type: 'coins/update',
          payload: {
            list,
            coinNamesMap,
            poolCoinsMap, // 未使用
            kumexCoinsMap, // 未使用
            poolCoins: data.pool, // 未使用
            kumexCoins: data.kumex, // 未使用
          },
        });
      } catch (e) {
        console.log('getCoinsCategory', e);
        yield call(delay, 3000);
        yield put({ type: 'pull' });
      }
    },
  },
  subscriptions: {
    // FIXME: 移到 RootV4 useInit 请求中，V3 已下线，暂不添加
    // setUpCategories({ dispatch }) {
    //   dispatch({ type: 'pull' });
    // },
  },
});
