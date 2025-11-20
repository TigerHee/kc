/**
 * Owner: roger.chen@kupotech.com
 */
import extend from 'dva-model-extend';
import {
  getAllCoins,
  getCoinsCategory,
  getUserFavSymbols,
  userCollectFavSymbol,
} from 'services/symbols';
import {baseModel} from 'utils/dva';
import {includes, remove} from 'lodash';

const maxPrecision = 8;

export default extend(baseModel, {
  namespace: 'symbols',
  state: {
    reaperSupportCoinList: [],
    categories: {},
    favSymbols: undefined,
  },
  effects: {
    *getCoinsCategory({payload}, {put, call}) {
      const {success, data} = yield call(getCoinsCategory);
      if (success) {
        const categories = {};
        (data.kucoin || []).forEach(item => {
          item.precision = parseInt(item.precision || maxPrecision, 10);
          categories[item.currency] = item;
        });
        yield put({type: 'update', payload: {categories}});
      }
    },
    *getAllCoins({payload}, {put, call}) {
      const {success, data} = yield call(getAllCoins);
      if (success) {
        yield put({type: 'update', payload: {reaperSupportCoinList: data}});
      }
    },
    *getUserFavSymbols({payload}, {put, call}) {
      const {success, data} = yield call(getUserFavSymbols);
      if (success) {
        yield put({type: 'update', payload: {favSymbols: data || []}});
      }
    },
    *collectFavSymbol({payload}, {put, call, select}) {
      const {symbol} = payload || {};
      const {success} = yield call(userCollectFavSymbol, {symbol});
      if (success) {
        try {
          const {favSymbols} = yield select(state => state.symbols);
          const _favSymbols = favSymbols || [];
          if (includes(_favSymbols, symbol)) {
            remove(_favSymbols, symbol);
          } else {
            _favSymbols.push(symbol);
          }
          yield put({type: 'update', payload: {favSymbols: _favSymbols || []}});
        } catch (e) {
          console.error(e);
        }
        yield put({type: 'getUserFavSymbols'});
      }
      return success;
    },
  },
});
