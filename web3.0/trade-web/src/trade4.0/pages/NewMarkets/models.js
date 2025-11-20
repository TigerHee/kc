/**
 * Owner: clyne@kupotech.com
 */

import extend from 'dva-model-extend';
import {
  DEFAULT_NAV,
  LIST_TYPE,
  defaultFav,
  defaultState,
  namespace,
  FAVOR_ENUM,
  BUSINESS_ENUM,
} from '@/pages/NewMarkets/config';
import base from 'common/models/base';
import polling from 'common/models/polling';
import {
  pullAllNav,
  pullCollectList,
  pullNavList,
  setCoinCollect,
  setFuturesCollect,
  setSpotCollect,
} from 'src/trade4.0/services/market';
import { formatCoinNav, formatFuturesNav, formatSpotNav, getFavCache, setFavCache } from './utils';
import { cloneDeep, filter, forEach, isEqual } from 'lodash';
import { sleep } from 'src/helper';
import { isDisplayFutures } from '@/meta/multiTenantSetting';

// OrderBook
export default extend(base, polling, {
  namespace,
  state: defaultState,
  effects: {
    /**
     * 获取nav
     */
    *getNav({ payload = {} }, { put, call, select }) {
      try {
        const oriNav = yield select((state) => state[namespace].nav);
        const nav = cloneDeep(oriNav);
        const results = yield call(pullAllNav);

        let coinData;
        let coinSuccess;
        let spotData;
        let spotSuccess;
        let spotNewData;
        let spotNewSuccess;
        let futuresData;
        let futuresSuccess;
        if (isDisplayFutures()) {
          [
            { data: coinData, success: coinSuccess },
            { data: spotData, success: spotSuccess },
            { data: spotNewData, success: spotNewSuccess },
            { data: futuresData, success: futuresSuccess },
          ] = results;
        } else {
          [
            { data: coinData, success: coinSuccess },
            { data: spotData, success: spotSuccess },
            { data: spotNewData, success: spotNewSuccess },
          ] = results;
        }

        if (spotSuccess && spotNewSuccess && spotData && spotNewData) {
          formatSpotNav(spotData, spotNewData, nav);
        }
        if (isDisplayFutures()) {
          if (futuresData && futuresSuccess) {
            formatFuturesNav(futuresData, nav);
          }
        }

        if (coinData && coinSuccess) {
          formatCoinNav(coinData?.items || [], nav);
        }
        yield put({
          type: 'update',
          payload: { nav, timestamp: Date.now() },
        });
      } catch (e) {
        // 报错的时候，更新默认nav
        yield put({
          type: 'update',
          payload: { nav: DEFAULT_NAV, timestamp: Date.now() },
        });
        yield call(sleep, 10000);
        yield put({ type: 'getNav' });
      }
    },

    /**
     * 根据nav参数获取列表
     */
    *getList({ payload = {} }, { put, call, select }) {
      const { isNext, currentPage, responseKey, keyword, isSearchAll, ...others } = payload;
      const curPage = isNext ? currentPage + 1 : currentPage;
      const params = isSearchAll
        ? {
            currentPage: curPage,
            keyword,
            returnAll: true,
          }
        : {
            ...others,
            keyword,
            currentPage: curPage,
          };
      const { data } = yield call(pullNavList, params);

      if (isSearchAll) {
        const { spotSymbols, marginSymbols, kumexSymbols } = data;
        const { items: spotItems = [], total: spotTotal = 0 } = spotSymbols || {};
        const { items: marginItems = [], total: marginTotal = 0 } = marginSymbols || {};
        const { items: futuresItems = [], total: futuresTotal = 0 } = kumexSymbols || {};
        yield put({
          type: 'update',
          payload: {
            data: [],
            searchTime: Date.now(),
            searchData: {
              [BUSINESS_ENUM.SPOT]: {
                total: spotTotal,
                data: spotItems.splice(0, 5),
              },

              [BUSINESS_ENUM.MARGIN]: {
                total: marginTotal,
                data: marginItems.splice(0, 5),
              },

              [BUSINESS_ENUM.FUTURES]: {
                total: futuresTotal,
                data: futuresItems.splice(0, 5),
              },
            },
          },
        });
      } else {
        const oriList = yield select((state) => {
          const ori = state[namespace].data;
          return ori === 'updating' ? [] : ori;
        });
        const { items: list, total } = data[responseKey] || {};
        const listData = list || [];
        console.log('======current update', curPage);
        yield put({
          type: 'update',
          payload: {
            data: isNext ? oriList.concat(listData) : listData,
            currentPage: curPage,
            total,
          },
        });
      }
    },

    /**
     * 获取collect
     */
    *getCollect({ payload = {} }, { put, call, select }) {
      const { type } = payload;
      const cache = cloneDeep(getFavCache() || defaultFav);
      // const [coinData, spotData, futuresData] = yield call(pullCollectList, type);
      // const coinArr = [];
      // forEach(coinData.data.data, ({ baseCurrency }) => {
      //   coinArr.push(baseCurrency);
      // });

      // const spotArr = [];
      // forEach(spotData.data.data, ({ symbolCode }) => {
      //   spotArr.push(symbolCode);
      // });

      // const futuresArr = [];
      // forEach(futuresData.data.data, ({ symbolCode }) => {
      //   futuresArr.push(symbolCode);
      // });

      const { data } = yield call(pullCollectList, type);
      const { favouriteCurrencies, favouriteSpotSymbols, favouriteKumexSymbols } = data;
      const coinArr = [];
      if (favouriteCurrencies) {
        forEach(favouriteCurrencies.items, ({ baseCurrency }) => {
          coinArr.push(baseCurrency);
        });
      }

      const spotArr = [];
      if (favouriteSpotSymbols) {
        forEach(favouriteSpotSymbols.items, ({ symbolCode }) => {
          spotArr.push(symbolCode);
        });
      }

      const futuresArr = [];
      if (favouriteKumexSymbols) {
        forEach(favouriteKumexSymbols.items, ({ symbolCode }) => {
          futuresArr.push(symbolCode);
        });
      }

      const responseMap = {
        [FAVOR_ENUM.COIN]: coinArr,
        [FAVOR_ENUM.SPOT]: spotArr,
        [FAVOR_ENUM.MARGIN]: spotArr,
        [FAVOR_ENUM.FUTURES]: futuresArr,
      };

      // 不想等则update
      if (!isEqual(responseMap, cache)) {
        setFavCache(responseMap);
        yield put({
          type: 'update',
          payload: {
            fav: responseMap,
          },
        });
      }
    },

    /**
     * 收藏 / 取消搜藏
     */
    *collect({ payload = {} }, { put, call, select }) {
      const {
        currentKey,
        currentState,
        dataKey,
        item: { baseCurrency: itemBaseCurrency, symbolCode: itemSymbolCode },
        isFavor,
      } = payload;
      const all = yield select((state) => state[namespace].fav);
      const data = yield select((state) => state[namespace].data);
      const allFav = cloneDeep(all);
      const oriData = cloneDeep(data);
      // 已经收藏，取消搜藏
      if (currentState) {
        allFav[dataKey] = filter(allFav[dataKey], (v) => v !== currentKey);
      } else {
        allFav[dataKey].push(currentKey);
      }

      const retPayload = {
        fav: { ...allFav },
      };

      // 删除取消收藏的data数据
      if (currentState && isFavor) {
        retPayload.data = filter(oriData, ({ baseCurrency, symbolCode }) => {
          return !(itemBaseCurrency === baseCurrency && itemSymbolCode === symbolCode);
        });
      }

      // 状态修改
      yield put({
        type: 'update',
        payload: retPayload,
      });
      // 币种
      if (dataKey === FAVOR_ENUM.COIN) {
        yield call(setCoinCollect, {
          configType: 'userFavouriteCurrencies',
          configValue: JSON.stringify(allFav[dataKey]),
        });
        // 现货杠杆
      } else if (dataKey === FAVOR_ENUM.SPOT || dataKey === FAVOR_ENUM.MARGIN) {
        yield call(setSpotCollect, {
          symbol: currentKey,
        });
        // 合约
      } else if (dataKey === FAVOR_ENUM.FUTURES) {
        yield call(setFuturesCollect, {
          symbol: currentKey,
        });
      }
      // 缓存
      setFavCache(allFav);
    },
  },

  subscriptions: {},
});
