/**
 * Owner: garuda@kupotech.com
 * 市场价格
 */

import extend from 'dva-model-extend';
import { find, map, forEach, cloneDeep } from 'lodash';
import base from 'common/models/base';
import polling from 'common/models/polling';
import {
  getFuturesLPAndMP,
  getContractDetail,
  getRecommendedList,
  getMarketList,
  getBestTicker,
} from '@/services/futures';
import { sortedMarket, getPrefixTopic } from '@/utils/futures';
import { pullNavList } from '@/services/market';
import { evtEmitter } from 'helper';

import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import { futuresCalcControl } from '@/pages/Futures/components/SocketDataFormulaCalc/utils';
import { RAFTaskFallback } from 'src/trade4.0/hooks/common/usePageExpire';

const event = evtEmitter.getEvt('futures-socket-position');

export default extend(base, polling, {
  namespace: 'futuresMarket',
  state: {
    MPDict: {},
    IPDict: {},
    currentDetail: {},
    favSymbols: [], // 自选合约，用来做底部展示
    recommended: {}, // 推荐合约
    sortedMarkets: [], // 根据成交量涨跌幅排序的marketInfo
    bestInfo: {}, // 最佳买一卖一 { bestBidPrice 买一, bestAskPrice 卖一 }
    bestInfoMap: {}, // 买一卖一 symbol为key 的 map
  },
  effects: {
    /**
     * 获取标记价格根指数价格
     */
    *getMPAndIP({ payload }, { call, put, select }) {
      const { symbol } = payload;
      const MPDict = yield select((state) => state.futuresMarket.MPDict);
      const IPDict = yield select((state) => state.futuresMarket.IPDict);
      const { data, success } = yield call(getFuturesLPAndMP, payload);
      if (success && data) {
        const { value: markPrice, indexPrice } = data;
        yield put({
          type: 'update',
          payload: {
            MPDict: {
              ...MPDict,
              [symbol]: markPrice,
            },
            IPDict: {
              ...IPDict,
              [symbol]: indexPrice,
            },
          },
        });
      } else {
        console.error('Request error: futures get price fail');
      }
    },

    /**
     * 获取合约明细
     */
    *getContractDetail({ payload }, { call, put }) {
      const { success, data } = yield call(getContractDetail, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: { currentDetail: data },
        });
      }
    },

    /**
     * 获取推荐列表
     */
    *getRecommendedList(__, { call, put }) {
      try {
        const { data } = yield call(getRecommendedList);
        if (data) {
          yield put({
            type: 'update',
            payload: {
              recommended: data,
            },
          });
        }
      } catch (e) {
        throw e;
      }
    },
    /**
     * 获取 marketList
     */
    *getMarketList(_, { call, put }) {
      const oData = yield call(getMarketList);
      if (oData && Array.isArray(oData.data)) {
        const { data } = oData;
        yield put({
          type: 'update',
          payload: {
            sortedMarkets: sortedMarket(data),
          },
        });
      }
    },
    // 获取合约自选
    *getFuturesFavSymbols(_, { call, put }) {
      const oData = yield call(pullNavList, {
        currentPage: 1,
        keyword: '',
        pageSize: 15, // 最多取 15 条
        subCategory: 'future',
        tabType: 'FAVOURITE',
      });
      if (oData && oData.data.favouriteKumexSymbols) {
        const data = oData.data.favouriteKumexSymbols?.items || [];
        const favSymbols = map(data, (item) => {
          return {
            ...item,
            changeRate: item.changeRate24h,
            symbol: item.symbolCode,
          };
        });
        yield put({
          type: 'update',
          payload: {
            favSymbols,
          },
        });
      }
    },
    // 获取最佳行情价格
    *getBestTicker({ payload }, { call, put, select }) {
      const bestInfoMap = yield select((state) => state.futuresMarket.bestInfoMap);
      const oData = yield call(getBestTicker, payload);
      if (oData && oData?.data) {
        const { data } = oData;
        yield put({
          type: 'update',
          payload: {
            bestInfo: data,
            bestInfoMap: { ...bestInfoMap, [payload?.symbol]: data },
          },
        });
      }
    },
    // 更新 Socket fundingRate
    *updateFundingRate({ payload = {} }, { select, put }) {
      const { data } = payload;
      const currentDetail = yield select((state) => state.futuresMarket.currentDetail);
      const { data: socketData, topic } = data[0];
      const socketSymbol = topic.split(':')[1];
      if (currentDetail.symbol !== socketSymbol) {
        return;
      }
      const { granularity, fundingRate } = socketData;
      if (+granularity === 60000) {
        yield put({
          type: 'update',
          payload: {
            currentDetail: {
              ...currentDetail,
              predictedFundingFeeRate: fundingRate,
            },
          },
        });
      } else {
        yield put({
          type: 'update',
          payload: {
            currentDetail: {
              ...currentDetail,
              fundingFeeRate: fundingRate,
            },
          },
        });
      }
    },
    // 更新 Socket Snapshot 值
    *updateVolume({ payload = {} }, { select, put }) {
      const { data = [] } = payload;
      const { sortedMarkets: _prevMarketList } = yield select((state) => state.futuresMarket);
      const updateMarket = new Map();
      // 遍历数据，将其存储在 updateMarket Map 中，以便后续使用
      _prevMarketList.forEach((item) => {
        updateMarket.set(item.symbol, item);
      });
      data.forEach((item) => {
        if (item.data) {
          updateMarket.set(item.data.symbol, {
            symbol: item.data.symbol,
            lastPrice: item.data.lastPrice,
            priceChgPct: item.data.priceChgPct,
          });
        }
      });
      const marketList = Array.from(updateMarket, ([, value]) => value);
      // 更新状态
      yield put({
        type: 'update',
        payload: {
          sortedMarkets: sortedMarket(marketList),
        },
      });
    },
    // 更新 Socket Ticker 消息
    *updateTickerPrice({ payload = {} }, { select, put }) {
      const { data = [] } = payload;
      const { sortedMarkets: prevMarketList } = yield select((state) => state.futuresMarket);
      const updateTicker = {};
      data.forEach((item) => {
        const currentItem = item.data;
        if (currentItem) {
          updateTicker[currentItem.symbol] = currentItem;
        }
      });
      const marketList = prevMarketList.map((item) => {
        if (updateTicker[item.symbol]) {
          item.lastPrice = updateTicker[item.symbol].price;
        }
        return item;
      });
      yield put({
        type: 'update',
        payload: {
          sortedMarkets: sortedMarket(marketList),
        },
      });
    },
    // 更新 Socket 标记价格跟指数价格 消息
    *updateMarkIndexPrice({ payload = {} }, { select, put }) {
      const { data = [] } = payload;
      const { MPDict, IPDict } = yield select((state) => state.futuresMarket);
      const updateMP = { ...MPDict };
      const updateIP = { ...IPDict };
      forEach(data, (item) => {
        const { data: itemData = {}, topic } = item;
        const { indexPrice, markPrice, symbol: itemSymbol } = itemData || {};
        const symbol = itemSymbol || getPrefixTopic(topic);
        if (indexPrice) {
          updateIP[symbol] = indexPrice;
        }
        if (markPrice) {
          updateMP[symbol] = markPrice;
        }
      });
      yield put({
        type: 'update',
        payload: {
          MPDict: updateMP,
          IPDict: updateIP,
        },
      });

      return { updateMP, updateIP };
    },
  },
  subscriptions: {
    initSocketTopicMessage({ dispatch }) {
      futuresWorkerSocket.topicMarkIndexPrice((data) => {
        RAFTaskFallback(() => {
          dispatch({ type: 'updateMarkIndexPrice', payload: { data } });
        });
        const updateMarkPriceMap = {};
        forEach(data, (item) => {
          const { topic, data: { symbol: itemSymbol, markPrice } = {} } = item;
          const symbol = itemSymbol || getPrefixTopic(topic);
          updateMarkPriceMap[symbol] = markPrice;
        });
        // 触发仓位的计算逻辑
        event.emit('futures_start_position_calc', updateMarkPriceMap);
        // 触发一次计算
        futuresCalcControl.triggerCalc();
      });
      futuresWorkerSocket.topicFundingRate((data) => {
        dispatch({
          type: 'updateFundingRate',
          payload: {
            data,
          },
        });
      });
      futuresWorkerSocket.topicSnapshotVolume((data) => {
        RAFTaskFallback(() => {
          dispatch({
            type: 'updateVolume',
            payload: {
              data,
            },
          });
        });
      });
      futuresWorkerSocket.topicTickerPrice((data) => {
        RAFTaskFallback(() => {
          dispatch({
            type: 'updateTickerPrice',
            payload: {
              data,
            },
          });
        });
      });
    },
  },
});
