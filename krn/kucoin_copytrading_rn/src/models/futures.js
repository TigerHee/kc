/**
 * Owner: mike@kupotech.com
 */
import extend from 'dva-model-extend';
import map from 'lodash/map';

import {getContractCurrencies, getFuturesSymbolsAll} from 'services/futures';
import {baseModel} from 'utils/dva';
import {transformSymbolInfo} from 'utils/futures-helper';

// symbols, categories
/**
 * @description:
 * @return {*}
 */
export default extend(baseModel, {
  namespace: 'futures', // 这个model在订单中心使用
  state: {
    symbols: [],
    futuresSymbols: [],
    futuresSymbolsMap: {},
    futuresCurrencies: [],
    futuresCurrenciesMap: [],
  },
  effects: {
    *pullFuturesSymbols({payload}, {call, put}) {
      const {data} = yield call(getFuturesSymbolsAll, payload);
      const futuresSymbolsMap = {};
      const futuresSymbols = map(data, item => {
        futuresSymbolsMap[item.symbol] = transformSymbolInfo(item);
        return item.symbol;
      });

      yield put({
        type: 'update',
        payload: {
          futuresSymbols,
          futuresSymbolsMap,
        },
      });
    },
    *pullFutureCurrencies({payload}, {call, put}) {
      const {data} = yield call(getContractCurrencies, payload);
      const futuresCurrenciesMap = data?.reduce?.((a, b) => {
        return {
          ...a,
          [b.code]: b,
        };
      }, {});

      yield put({
        type: 'update',
        payload: {
          futuresCurrenciesMap,
          futuresCurrencies: data,
        },
      });
    },

    // 启动
    *init(_, {put, all}) {
      yield all([
        yield put({
          type: 'pullFuturesSymbols',
        }),
        yield put({
          type: 'pullFutureCurrencies',
        }),
      ]);
    },
  },
  subscriptions: {},
});
