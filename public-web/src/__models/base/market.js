/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import sort from 'common/models/sort';
import extend from 'dva-model-extend';
import { transStepToPrecision } from 'helper';
import _ from 'lodash';
import { STORAGE_MARKET_FILTER } from 'selector/storageKeys';
import {
  getDiscountSymbols,
  getFeeBySymbol,
  getIndexSamples,
  getIndexTickers,
  getIsolatedSymbolsByUser,
  getIsolatedSymbolsConfig,
  // getIndexCandles,
  getMarginConfigs,
  getMarginConfigsByUser,
  getMarketAreasNew,
  getMarketSymbols,
  getMarketSymbolsByQuote,
  getSymbol,
  getSymbolTick,
  getUserFavSymbols,
} from 'services/market';
import { delay } from 'utils/delay';
import storage from 'utils/storage';
import waitFor from 'utils/waitForSaga';

const FAVORITES_SCOPE_MAP = {
  CURRENCY: 'market_currency_favorites',
  TRADE: 'market_trade_favorites',
  FUTURE: 'market_future_favorites',
};

const FAVORITES_SCOPE = {
  CURRENCY: 'CURRENCY',
  TRADE: 'TRADE',
  FUTURE: 'FUTURE',
};

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;
// effect执行计数
const effectsCount = {};

const __SPOT_INDEX__ = 'SPOT_INDEX';

const _updateAreaSymbols = (state, area, records) => {
  const temp = [..._.map(state.symbolsMap, (r) => r), records];
  // coin-pair map；
  const coinPairMap = _.reduce(
    temp,
    (result, cur) => {
      return _.reduce(
        cur,
        (rslt, ccur) => {
          return {
            ...rslt,
            [ccur.symbol]: { ...ccur },
          };
        },
        {},
      );
    },
    {},
  );

  return {
    ...state,
    symbolsMap: {
      ...state.symbolsMap,
      [area]: records,
    },
    coinPairMap: {
      ...state.coinPairMap,
      ...coinPairMap,
    },
  };
};
// allRecords symbolsInfoMap feeInfoMap records allRecords pullFeeBySymbol
export default extend(base, sort, filter, polling, {
  namespace: 'market',
  state: {
    filters: {
      area: '',
    },
    areas: [],
    areasMap: {},
    marginConfigs: {},
    records: [], // 所有的交易对
    favRecords: [],
    symbolsMap: {},
    stickSymbols: [],
    favSymbols: [],
    coinPairMap: {},
    discountSymbolRecords: [],
    feeInfoMap: {},
    disabledTipMap: {},
    // 包含交易对的步长，费率等基本信息
    // symbolsInfo: [],
    symbolsInfoMap: {},
    allRecords: [], // 所有的交易对（原有records 因为缺少部分交易对，所以另外存一份）
    spotIndexSymbol: '',
    sampleRecords: [],
    tickers: [],
    tickersMap: {},
    isolatedSymbols: [],
    isolatedSymbolsMap: {},
  },
  reducers: {
    updateAreas(state, { payload }) {
      const { areas = [], areasMap = {} } = payload || {};
      return {
        ...state,
        areas,
        areasMap,
      };
    },
    updateFilters(state, { payload }) {
      return {
        ...state,
        filters: payload,
      };
    },
    updateAreaSymbols(state, { payload: { area, records } }) {
      return _updateAreaSymbols(state, area, records);
    },
    updateFeeInfo(state, { payload: { feeInfo } }) {
      return {
        ...state,
        feeInfoMap: {
          ...state.feeInfoMap,
          [feeInfo.symbol]: feeInfo.data,
        },
      };
    },
    updateDisabledTip(state, { payload: { disabledTip } }) {
      return {
        ...state,
        disabledTipMap: {
          ...state.disabledTipMap,
          [disabledTip.symbol]: disabledTip.data,
        },
      };
    },
    updateSymbolsInfo(state, { payload }) {
      const { data = [] } = payload;
      const symbolsInfoMap = {};
      const size = (data || []).length;
      for (let i = 0; i < size; i++) {
        const val = data[i];
        symbolsInfoMap[val.code] = val;
      }
      // const symbolsInfoMap = _.reduce(
      //   data || [],
      //   (result, val) => {
      //     return {
      //       ...result,
      //       [val.code]: val,
      //     };
      //   },
      //   {},
      // );
      return {
        ...state,
        // symbolsInfo: data || [],
        symbolsInfoMap,
      };
    },
    /** websocket 合并更新 state */
    updateByWs(state, { payload: { areaMap, favRecords } }) {
      let newState = {
        ...state,
        favRecords,
      };
      _.each(areaMap, (records, area) => {
        newState = _updateAreaSymbols(newState, area, records);
      });

      return newState;
    },
  },
  effects: {
    *proxyFilter(action, { put, select }) {
      delete action.type;
      yield put({
        type: 'filter',
        ...action,
      });
      // 代理 filter effect 避免 common/filter 耦合 market model
      const save = yield select((state) => {
        return state.market.filters;
      });
      if (save) {
        storage.setItem(STORAGE_MARKET_FILTER, save);
      }
    },
    *pullAreas(action, { call, put }) {
      try {
        const { data = [] } = yield call(getMarketAreasNew);
        if (data && data.length) {
          const list = [];
          const map = {};
          data.forEach((item) => {
            const { name = '', displayName = '', quotes = [], label } = item || {};
            if (name) {
              list.push(name);
              map[name] = {
                displayName: displayName || name,
                quotes,
                label,
              };
            }
          });
          yield put({
            type: 'updateAreas',
            payload: {
              areas: list,
              areasMap: map,
            },
          });
        }
      } catch (e) {
        yield call(delay, 3000);
        yield put({ type: 'pullAreas' });
      }
    },
    *pullMarginConfigs(_, { call, put, select }) {
      const { isLogin } = yield select((state) => state.user);
      if (effectsCount[`pullMarginConfigs${isLogin}`]) return;
      effectsCount[`pullMarginConfigs${isLogin}`] = 1;
      const { data } = yield call(isLogin ? getMarginConfigsByUser : getMarginConfigs);
      yield put({
        type: 'update',
        payload: {
          marginConfigs: data,
        },
      });
    },
    *pullIsolatedSymbols(action, { call, put, select }) {
      const { isLogin } = yield select((state) => state.user);
      if (effectsCount[`pullIsolatedSymbols${isLogin}`]) return;
      effectsCount[`pullIsolatedSymbols${isLogin}`] = 1;
      const { data } = yield call(isLogin ? getIsolatedSymbolsByUser : getIsolatedSymbolsConfig);
      const isolatedSymbolsMap = {};
      _.map(data, (item) => {
        isolatedSymbolsMap[item.symbol] = item;
        return item;
      });
      yield put({
        type: 'update',
        payload: {
          isolatedSymbols: data,
          isolatedSymbolsMap,
        },
      });
    },
    // 此方法只取全部交易对，allRecords 只装全部交易对
    *pull(action, { call, put }) {
      const { data } = yield call(getMarketSymbols, {});
      // const allRecords = data;
      const allRecords = data.map((item) => {
        const { baseIncrement, priceIncrement, quoteIncrement } = item;
        return {
          ...item,
          basePrecision: transStepToPrecision(baseIncrement),
          pricePrecision: transStepToPrecision(priceIncrement),
          quotePrecision: transStepToPrecision(quoteIncrement),
        };
      });
      const records = allRecords.filter((item) => item.enableTrading);
      // 将交易对的全部信息保存
      // .map(({ symbol, baseCurrency, quoteCurrency }) => {
      //   return { symbol, baseCurrency, quoteCurrency };
      // });
      yield put({ type: 'updateSymbolsInfo', payload: { data: allRecords } });

      yield put({ type: 'update', payload: { records, allRecords } });
    },
    // 用户收藏的行情列表
    *pullFavRecords(action, { call, put, select }) {
      const { favSymbols = [] } = yield select((state) => state.market);
      const symbols = favSymbols.join();
      if (!symbols || symbols === 'null') {
        yield put({ type: 'update', payload: { favRecords: [] } });
      } else {
        const { data } = yield call(getSymbolTick, { symbols });
        const records = data.filter((item) => !!item) || [];
        yield put({
          type: 'update',
          payload: {
            favRecords: records.sort((a, b) => {
              return +b.volValue - +a.volValue;
            }),
          },
        });
      }
    },
    *sortMarketRecords({ payload }, { select, put }) {
      const { area, records } = yield select(({ market }) => {
        const {
          filters: { area },
          symbolsMap,
        } = market;
        return {
          area,
          records: symbolsMap[area] || [],
        };
      });
      var [{ sorter, sortOrder }, oldList, sortArgs] = payload;
      const orderHandle = (val) => {
        if (Number.isNaN(val) || val === 0 || val === false) return 0;
        if (sortOrder === 'descend') return -val;
        return val;
      };
      const usedSorter = (a, b) => {
        // 默认排序方式
        if (!sortOrder) return +b.volValue - +a.volValue;
        return orderHandle(sorter(a, b, ...sortArgs));
      };
      const { list } = yield yield put({
        type: 'getRecordOrder',
        payload: {
          area,
          sorter: usedSorter,
          oldList,
          list: records.sort((a, b) => b?.board - a?.board),
        },
      });
      yield put({
        type: 'updateAreaSymbols',
        payload: {
          area,
          records: list,
        },
      });
    },
    // 根据交易市场获取行情列表
    *pullMarketRecordsByArea({ payload: { area } }, { call, put }) {
      const usedArea = area || 'BTC';
      const { data } = yield call(getMarketSymbolsByQuote, { quote: usedArea });
      const records = data.filter((item) => !!item) || [];
      const { list } = yield yield put({
        type: 'getRecordOrder',
        payload: {
          area: usedArea,
          list: records
            .sort((a, b) => {
              return +b.volValue - +a.volValue;
            })
            .sort((a, b) => b?.board - a?.board),
        },
      });
      yield put({
        type: 'updateAreaSymbols',
        payload: {
          area,
          records: list,
        },
      });
    },
    // 获取老的排列顺序,返回排序后的数据
    *getRecordOrder({ payload: { area, list, oldList, sorter } }, { select }) {
      if (!Array.isArray(oldList)) {
        oldList = yield select(({ market }) => {
          const {
            filters: { area: areaOld },
            symbolsMap,
          } = market;
          return symbolsMap[area || areaOld] || [];
        });
      }
      const uniqueKey = 'symbolCode';
      // 保证顺序不变
      const sortOrderMap = {};
      if (typeof sorter === 'function') {
        oldList = oldList.sort(sorter);
      }
      _.each(oldList, (_item, index) => {
        if (_item) {
          sortOrderMap[_item[uniqueKey]] = index;
        }
      });
      const hasOrder = !!Object.keys(sortOrderMap).length;
      let newList = [];
      if (hasOrder) {
        const restList = [];
        _.each(list, (item) => {
          const index = sortOrderMap[item[uniqueKey]];
          if (index != null && index >= 0) {
            newList[index] = item;
          } else {
            restList.push(item);
          }
        });
        newList = [...newList, ...restList].filter((item) => !!item);
      } else {
        newList = list;
      }
      return { hasOrder, list: newList };
    },

    // 获取指数币种实时价格
    *pullIndexTickers({ payload: { area } }, { call, put }) {
      const { data } = yield call(getIndexTickers);
      const records = _.map(data.filter((item) => !!item) || [], (v, i) => {
        const [baseCurrency, quoteCurrency] = v.symbol.split('-');
        return {
          baseCurrency,
          changeRate: v.change,
          close: v.close,
          high: v.high,
          lastTradedPrice: v.price,
          low: v.low,
          open: v.open,
          quoteCurrency,
          sort: i + 1,
          symbol: v.name,
          symbolCode: v.symbol,
          trading: true,
          board: 0,
        };
      });
      const { list } = yield yield put({
        type: 'getRecordOrder',
        payload: {
          area,
          list: records.sort((a, b) => b?.board - a?.board),
        },
      });
      yield put({
        type: 'updateAreaSymbols',
        payload: { area, records: list },
      });
    },

    *query(action, { put, select }) {
      const { area } = yield select((state) => state.market.filters);
      if (area === __SPOT_INDEX__) {
        yield put({ type: 'pullIndexTickers', payload: { area } });
      } else {
        yield put({ type: 'pullMarketRecordsByArea', payload: { area } });
      }
    },

    /** ws data update */
    *updateSnapshotByMap({ payload }, { put, select }) {
      const map = payload;

      const [oldSymbolsMap, oldFavRecords, filters] = yield select((state) => [
        state.market.symbolsMap,
        state.market.favRecords || [],
        state.market.filters,
      ]);
      const { area = '' } = filters || {};

      /** area markets */
      const areaMap = {};
      _.map(map, (item) => {
        const { market, markets, symbolCode } = item;
        const marketUse = area && markets && _.includes(markets, area) ? area : market;
        if (!areaMap[marketUse]) {
          areaMap[marketUse] = [...(oldSymbolsMap[marketUse] || [])];
        }
        const records = areaMap[marketUse];
        _.each(records, (_item, index) => {
          if (_item.symbolCode === symbolCode) {
            records[index] = item;
            return false;
          }
        });
      });

      /** 自选 */
      const favRecords = [...oldFavRecords];
      _.each(favRecords, (item, index) => {
        const { symbolCode } = item;
        if (map[symbolCode]) {
          favRecords[index] = map[symbolCode];
        }
      });
      yield put({
        type: 'updateByWs',
        payload: { areaMap, favRecords },
      });
    },

    *pullUserFavSymbols(action, { call, put, select, take }) {
      const { user } = yield select((state) => state.user);
      let data = [];
      if (user) {
        const { data: resData } = yield call(getUserFavSymbols);
        data = resData;
      } else {
        data = yield call(storage.getItem, FAVORITES_SCOPE_MAP['TRADE']);
      }
      if (data?.length) {
        yield put({
          type: 'update',
          payload: { favSymbols: data },
        });
      }
    },

    *clearSelfSymbols(action, { put }) {
      yield put({
        type: 'update',
        payload: {
          favSymbols: [],
          stickSymbols: [],
        },
      });
    },

    *pullFeeBySymbol({ payload: { symbol } }, { call, put }) {
      const { data } = yield call(getFeeBySymbol, symbol);
      data.createdAt = new Date();
      yield put({ type: 'updateFeeInfo', payload: { feeInfo: { symbol, data } } });
    },

    *pullDisabledTip({ payload: { symbol } }, { call, put }) {
      const { data = {} } = yield call(getSymbol, { symbol });
      const disabledTip = { tip: data.disabledTip };
      disabledTip.createdAt = new Date();
      yield put({
        type: 'updateDisabledTip',
        payload: { disabledTip: { symbol, data: disabledTip } },
      });
    },

    *pullDiscountSymbols(action, { call, put }) {
      const { data } = yield call(getDiscountSymbols);
      yield put({ type: 'update', payload: { discountSymbolRecords: data ? [...data] : [] } });
    },
    *pullSamples({ payload }, { call, put }) {
      const { data = [] } = yield call(getIndexSamples, payload);
      yield put({
        type: 'update',
        payload: {
          sampleRecords: data,
        },
      });
    },
    *pullTickers({ payload = {} }, { call, put }) {
      const { data = [] } = yield call(getIndexTickers, payload);
      const tickersMap = {};
      _.each(data, (item) => {
        tickersMap[item.symbol] = item;
      });
      yield put({
        type: 'update',
        payload: { tickers: data, tickersMap },
      });
    },
    *triggerPolling({ payload }, { put }) {
      yield put({
        type: 'watchPolling',
        payload: { effect: 'pullSamples', interval: 20 * 1000 },
      });
    },
    *watchUser(action, { select, put, take, call }) {
      yield call(waitFor, (state) => !!state.user.user, { select, take });
      yield put({ type: 'pullDiscountSymbols' });
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      setTimeout(() => {
        dispatch({ type: 'pullAreas' });
        dispatch({ type: 'pull' });
        const filterState = storage.getItem(STORAGE_MARKET_FILTER) || {};
        dispatch({ type: 'proxyFilter', payload: { area: filterState.area || 'BTC' } });
      });
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullFavRecords', interval: 60 * 1000 },
      });
      dispatch({ type: 'watchPolling', payload: { effect: 'proxyFilter', interval: 60 * 1000 } });
    },
    watch({ dispatch }) {
      dispatch({
        type: 'watchUser',
      });
    },
    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      import('@kc/socket').then((ws) => {
        const socket = ws.getInstance();
        socket.topicMessage(ws.Topic.MARKET_SNAPSHOT, 'trade.snapshot')(
          (arr) => {
            const map = {};
            // 后来的先覆盖
            _.eachRight(arr, (_message) => {
              const { data: { data } = {} } = _message;
              const { symbolCode } = data;
              if (!map[symbolCode]) {
                map[symbolCode] = data;
              }
            });
            /** update */
            dispatch({ type: 'updateSnapshotByMap', payload: map });
          },
          500,
          true,
        );
      });
    },
  },
});
