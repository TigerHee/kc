/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import { delay } from 'utils/delay';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import sort from 'common/models/sort';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import storage from 'utils/storage';
import {
  getMarketSymbols,
  getMarketSymbolsByQuote,
  getUserFavSymbols,
  userCollectFavSymbol,
  getMarketAreasNew,
  getSymbolTick,
  getFeeBySymbol,
  getDiscountSymbols,
  getSymbol,
  getIndexTickers,
  getIndexSamples,
  // getIndexCandles,
  getMarginConfigs,
} from 'services/market';
import { getAllSymbolConfigs } from 'services/isolated';
import { STORAGE_MARKET_FILTER } from 'selector/storageKeys';
import { transStepToPrecision } from 'helper';
import { __SPOT_INDEX__ } from 'components/Markets/config';
import waitFor from 'utils/waitForSaga';

// const socket = ws.getInstance();

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

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

export default extend(base, sort, filter, polling, {
  namespace: 'market',
  state: {
    filters: {
      area: '',
    },
    areas: [],
    areasMap: {},
    marginConfigs: {},
    isolatedSymbols: [],
    isolatedSymbolsMap: {}, // 逐仓杠杆配置
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
      const symbolsInfoMap = _.reduce(
        data || [],
        (result, val) => {
          return {
            ...result,
            [val.code]: val,
          };
        },
        {},
      );
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
    // 复写 filter effect，解除 common/filter 对 market 的耦合
    *filter({ type, payload, override, effect = 'query', key = 'filters' }, { put, select }) {
      yield put({ type: 'updateFilters', payload, override, key });
      const save = yield select((state) => {
        return state.market.filters;
      });
      if (save) {
        storage.setItem(STORAGE_MARKET_FILTER, save);
      }
      if (effect) {
        yield put({ type: effect });
      }
    },
    *pullAreas(action, { call, put }) {
      try {
        const { data = [] } = yield call(getMarketAreasNew);
        if (data && data.length) {
          const list = [];
          const map = {};
          data.forEach((item) => {
            const { name = '', displayName = '', quotes = [] } = item || {};
            if (name) {
              list.push(name);
              map[name] = {
                displayName: displayName || name,
                quotes,
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
        const { data: marginConfigs = {} } = yield call(getMarginConfigs);
        yield put({
          type: 'update',
          payload: {
            marginConfigs,
          },
        });
      } catch (e) {
        yield call(delay, 3000);
        yield put({ type: 'pullAreas' });
      }
    },

    *pullIsolatedSymbols(_, { call, put }) {
      const { data: isolatedSymbols = [] } = yield call(getAllSymbolConfigs);
      const isolatedSymbolsMap = {};
      _.map(isolatedSymbols, (item) => {
        isolatedSymbolsMap[item.symbol] = item;
        return item;
      });
      yield put({
        type: 'update',
        payload: {
          isolatedSymbols,
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
    // 根据交易市场获取行情列表
    *pullMarketRecordsByArea({ payload: { area } }, { call, put }) {
      const { data } = yield call(getMarketSymbolsByQuote, { quote: area || 'BTC' });
      const records = data.filter((item) => !!item) || [];
      yield put({
        type: 'updateAreaSymbols',
        payload: {
          area,
          records: records.sort((a, b) => {
            return +b.volValue - +a.volValue;
          }),
        },
      });
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
      yield put({
        type: 'updateAreaSymbols',
        payload: { area, records },
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

      const [oldSymbolsMap, oldFavRecords] = yield select((state) => [
        state.market.symbolsMap,
        state.market.favRecords || [],
      ]);

      /** area markets */
      const areaMap = {};
      _.map(map, (item) => {
        const { market, symbolCode } = item;
        if (!areaMap[market]) {
          areaMap[market] = [...(oldSymbolsMap[market] || [])];
        }

        const records = areaMap[market];
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

    // 2.0尚未用到
    // *pullAllAreaSymbols({ payload = {} }, { put, select }) {
    //   const { areas } = yield select(state => state.market);

    //   for (let i = 0; i < areas.length; i += 1) {
    //     yield put({ type: 'pullMarketRecordsByArea', payload: { area: areas[i] } });
    //   }
    // },

    *pullUserFavSymbols(action, { call, put }) {
      const { data } = yield call(getUserFavSymbols);
      if (data) {
        yield put({
          type: 'update',
          payload: { favSymbols: data },
        });
      }
    },

    *userCollectFavSymbol({ payload: { symbol } }, { call, put }) {
      yield call(userCollectFavSymbol, { symbol });
      yield put({
        type: 'pullUserFavSymbols',
      });
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
    *watchUser(action, { select, put, take, call }) {
      yield call(waitFor, (state) => !!state.user.user, { select, take });
      yield put({ type: 'market/pullDiscountSymbols' });
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({ type: 'pullIsolatedSymbols' });
      dispatch({ type: 'pullAreas' });
      dispatch({ type: 'pull' });
      const filterState = storage.getItem(STORAGE_MARKET_FILTER) || {};
      dispatch({ type: 'filter', payload: { area: filterState.area || 'BTC' } });
      // if (filterState) {
      //   dispatch({ type: 'filter', payload: filterState, effect: false });
      // }
      // dispatch({
      //   type: 'watchPolling',
      //   payload: { effect: 'pullAllAreaSymbols', interval: 60 * 1000 },
      // });
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullAreas', interval: 10 * 60 * 1000 },
      });
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullFavRecords', interval: 60 * 1000 },
      });
      dispatch({ type: 'watchPolling', payload: { effect: 'filter', interval: 60 * 1000 } });
      dispatch({ type: 'watchPolling', payload: { effect: 'pullSamples', interval: 20 * 1000 } });
      dispatch({ type: 'watchPolling', payload: { effect: 'pullTickers', interval: 20 * 1000 } });
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
      import('src/utils/socket').then(({ kcWs: socket, Topic }) => {
        subscriptionWs = true;
        socket.topicMessage(Topic.MARKET_SNAPSHOT, 'trade.snapshot')(
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
          { frequency: 500 },
        );
      });
    },
  },
});
