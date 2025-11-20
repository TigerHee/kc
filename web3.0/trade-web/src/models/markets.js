/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import { delay } from 'redux-saga/lib';
import { eachRight, each, map, indexOf, remove, uniq } from 'lodash';
import base from 'common/models/base';
import sort from 'common/models/sort';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import storage from 'utils/storage.js';
import {
  getMarketSymbolsByQuote,
  getSymbolTick,
  getQuotes,
  getUserFavSymbols,
  userCollectFavSymbol,
  getPopularSymbols,
  getRecentActive,
} from 'services/markets';
import { getHotMarketSymbols } from 'services/cms';
import tradeMarketsStore from 'src/pages/Trade3.0/stores/store.tradeMarkets';
import workerSocket from 'common/utils/socketProcess';
import { isABNew } from '@/meta/const';

const STORAGE_MARKET_FAV = 'market_fav_list';
const { getItem, setItem } = storage;

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

/** ws data update */
const updateSnapshotByMap = async ({ payload }) => {
  const { diffMap } = payload;
  const { records } = await tradeMarketsStore.handler.select(
    (state) => state.tradeMarkets,
  );
  each(records, (item, index) => {
    const { symbolCode } = item;
    if (diffMap[symbolCode]) {
      records[index] = diffMap[symbolCode];
    }
  });

  await tradeMarketsStore.handler.update({ records: [...records] });
};

export default extend(base, sort, filter, polling, {
  namespace: 'tradeMarkets',
  state: {
    areas: [], // 交易市场列表，包含子市场
    // records字段移入了store/tradeMarkets.store
    // records: [], // 行情列表
    hotSymbols: [], // 热门推荐
    searchSymbols: [], // 用户搜索出的symbols
    favSymbols: [], // 用户未登录状态下：用户未登录状态下； 用户登录状态下：服务端存储的favSymbols
    popularSymbols: [], // 热币榜
    displayByCurrency: false, // 是否显示法币价格
    filters: {
      area: 'USDS',
      childAreas: {},
      recordType: 0, // 0--某一市场下的行情列表 1--收藏下的行情列表 2--热门搜索下的行情列表 3--用户搜索下的行情列表
    },
    marginTab: 'ALL',
    infoOfClickMarginRow: null, // 点击行情里杠杆交易区的交易对时，记录点击信息
    prevAreaType: {
      area: 'BTC',
      childAreas: {
        BTC: 'BTC',
      },
      recordType: 0,
    }, // 用于存储上一次选择的市场名称
    fetchLoadingSwitch: false, // 控制点击收藏的按钮时，不需要展示loading效果
    search: '',
    recentActive: [],
  },
  reducers: {},
  effects: {
    *pullAreas(_, { call, put }) {
      // 获取交易市场
      try {
        const { data } = yield call(getQuotes);
        yield put({ type: 'update', payload: { areas: data } });
      } catch (e) {
        // yield call(delay, 3000);
        // yield put({ type: 'pullAreas' });
      }
    },

    // 获取热门搜索行情列表
    *pullHotSymbols(_, { call, put }) {
      const { items = [] } = yield call(getHotMarketSymbols);
      const hotSymbols = map(items, (item) => {
        return item.replace('/', '-');
      });
      yield put({
        type: 'update',
        payload: {
          hotSymbols,
        },
      });
    },

    // 获取新币专区 最近活动
    *pullRecentActive(action, { call, put }) {
      const { success, data } = yield call(getRecentActive, 'NEWEST');
      if (success) {
        yield put({
          type: 'update',
          payload: {
            recentActive: data || [],
          },
        });
      }
    },

    *pullUserFavSymbols({ payload = {} }, { call, put, select }) {
      const user = yield select((state) => payload?.user || state.user?.user);
      const { isMargin } = yield select((state) => state.marginMeta);
      if (user) {
        // 登陆中用户收藏保存在服务端，从服务器拉取
        const { data } = yield call(getUserFavSymbols);
        if (data) {
          // 在4.0 需要过滤当前可用的交易对
          if (isABNew()) {
            const { data: effectDatas } = yield call(getSymbolTick, {
              symbols: data,
            });
            const filterFavSymbols = effectDatas?.map((item) => {
              return item.symbolCode;
            });
            yield put({
              type: 'update',
              payload: { favSymbols: filterFavSymbols },
            });
          } else {
            yield put({
              type: 'update',
              payload: { favSymbols: data },
            });
          }
        }
      } else {
        const localstorageFav = getItem(STORAGE_MARKET_FAV);
        // 未登陆时，用户收藏保存在本地，从本地获取
        // eslint-disable-next-line no-lonely-if
        if (isABNew()) {
          // 在4.0 需要过滤当前可用的交易对
          if (localstorageFav?.length) {
            const { data = [] } = yield call(getSymbolTick, {
              symbols: localstorageFav,
            });
            const filterFavSymbols = data?.map((item) => {
              return item.symbolCode;
            });
            yield put({
              type: 'update',
              payload: { favSymbols: filterFavSymbols || [] },
            });
          } else {
            yield put({
              type: 'update',
              payload: { favSymbols: localstorageFav || [] },
            });
          }
        } else {
          yield put({
            type: 'update',
            payload: { favSymbols: localstorageFav || [] },
          });
        }
      }
      // 设置完成后拉取新数据
      if (!isMargin) {
        yield put({ type: 'query' });
      }
    },

    // 🔥 热币榜
    *getPopularSymbols({ payload = {} }, { call, put, select }) {
      const { data } = yield call(getPopularSymbols, {
        algorithm: 'HOT_CURRENCY',
        type: 'HOME_LIST',
        ...payload,
      });
      const list = (data?.items || []).map(({ symbolCode }) => symbolCode);
      yield put({
        type: 'update',
        payload: { popularSymbols: list },
      });
    },

    *userCollectFavSymbol({ payload: { symbol } }, { call, put, select }) {
      const { user } = yield select((state) => state.user);
      if (user) {
        // 登陆中用户收藏保存在服务端
        yield call(userCollectFavSymbol, { symbol });
      } else {
        // 未登陆时，用户收藏保存在本地
        const favSymbols = getItem(STORAGE_MARKET_FAV) || [];
        if (indexOf(favSymbols, symbol) < 0) {
          favSymbols.push(symbol);
        } else {
          remove(favSymbols, (favSymbol) => favSymbol === symbol);
        }
        setItem(STORAGE_MARKET_FAV, uniq(favSymbols));
      }
      yield put({ type: 'pullUserFavSymbols' });
    },

    // 根据交易对列表获取行情列表
    *pullRecordsBySymbols(
      { payload: { symbols = [] } },
      { call, put, select },
    ) {
      const query = symbols.join();
      if (!symbols || symbols === 'null') {
        yield tradeMarketsStore.handler.update({ records: [] });
      } else {
        const { data = [] } = yield call(getSymbolTick, { symbols: query });
        const records = data
          .filter((item) => !!item)
          .sort((a, b) => {
            return +b.volValue - +a.volValue;
          });
        const currentRecordType = yield select(
          (state) => state.tradeMarkets.filters.recordType,
        );
        // 修复点击杠杆交易对后，立刻点击其它市场，如果getSymbolTick 接口返回更慢，那records会展示为杠杆交易对数据
        if (currentRecordType !== 0) {
          yield tradeMarketsStore.handler.update({ records });
        }
      }
    },

    // 根据交易市场获取行情列表
    *pullMarketRecordsByArea({ payload: { area } }, { call, put, select }) {
      const { data = [] } = yield call(getMarketSymbolsByQuote, {
        quote: area || 'BTC',
      });
      const records = data
        .filter((item) => !!item)
        .sort((a, b) => {
          return +b.volValue - +a.volValue;
        });

      const currentRecordType = yield select(
        (state) => state.tradeMarkets.filters.recordType,
      );
      // 修复点击杠杆交易对后，立刻点击其它市场，如果getSymbolTick 接口返回更慢，那records会展示为杠杆交易对数据
      if (currentRecordType === 0) {
        yield tradeMarketsStore.handler.update({ records });
      }
    },

    *query({ payload = {} }, { put, select }) {
      const {
        tradeMarkets: {
          filters: { area, recordType },
          searchSymbols,
          hotSymbols,
          favSymbols,
        },
        symbols: { marginSymbols },
      } = yield select((state) => state);
      if (recordType === 0) {
        yield put({ type: 'pullMarketRecordsByArea', payload: { area } });
      } else {
        let symbols = [];
        if (recordType === 1) {
          symbols = favSymbols;
        } else if (recordType === 2) {
          symbols = hotSymbols;
        } else if (recordType === 3) {
          symbols = searchSymbols;
        } else if (recordType === 4) {
          symbols = marginSymbols;
        }
        yield put({ type: 'pullRecordsBySymbols', payload: { symbols } });
      }
    },
  },
  subscriptions: {
    setUpMarkets({ dispatch, state }) {
      // if (!isABNew()) {
      //   dispatch({ type: 'pullAreas' });
      //   dispatch({ type: 'pullUserFavSymbols' });
      // }

      // @deprected 未触发
      // dispatch({
      //   type: 'watchPolling',
      //   payload: { effect: 'pullAreas', interval: 60 * 60 * 1000 },
      // });
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'filter', interval: 60 * 60 * 1000 },
      });
      // dispatch({ type: 'watchPolling',
      //   payload: { effect: 'pullHotSymbols', interval: 60 * 1000 },
      // });
    },
    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      workerSocket.marketSnapshotMessage((arr) => {
        const diffMap = {};
        // 后来的先覆盖
        eachRight(arr, (_message) => {
          const { data: { data } = {} } = _message;
          const { symbolCode } = data;
          if (!diffMap[symbolCode]) {
            diffMap[symbolCode] = data;
          }
        });
        /** update */
        updateSnapshotByMap({ payload: { diffMap } });
      });
    },
  },
});
