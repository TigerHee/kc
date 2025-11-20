/*
 * @Owner: Clyne@kupotech.com
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import workerSocket from 'common/utils/socketProcess';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import { BUSINESS_ENUM, MARKET_SOCKET_EVENT, namespace } from '../config';
import { event } from 'src/trade4.0/utils/event';
import { cloneDeep, findIndex, forEach } from 'lodash';
import { getStore } from 'src/utils/createApp';
import { isDisplayMargin, isDisplayFutures } from '@/meta/multiTenantSetting';

const isSpot = (type) => {
  return type === 'spot';
};

const getSymbolsByData = (data) => {
  const symbols = [];
  forEach(data, ({ symbolCode }) => {
    symbols.push(symbolCode);
  });
  return symbols;
};

const checkType = (symbols) => {
  if (symbols[0] && /-/.test(symbols)) {
    return 'spot';
  } else if (symbols[0]) {
    return 'futures';
  }
};

const getTopic = (type, symbols) => {
  return isSpot(type)
    ? `/market/snapshot:${symbols.join()}`
    : `/contractMarket/snapshot:${symbols.join()}`;
};

const unSubscribe = (type, symbols) => {
  const api = isSpot(type) ? workerSocket : futuresWorkerSocket;
  const topic = getTopic(type, symbols);
  api.unsubscribe(topic);
};

const subscribe = (type, symbols) => {
  const _isSpot = isSpot(type);
  const api = _isSpot ? workerSocket : futuresWorkerSocket;
  const topic = getTopic(type, symbols);
  return api.subscribe(topic, false);
};

workerSocket.marketSnapshotMessage((ret) => {
  event.emit(MARKET_SOCKET_EVENT, ret);
});

futuresWorkerSocket.topicSnapshotVolume((ret) => {
  event.emit(MARKET_SOCKET_EVENT, ret);
});

export const useSocket = () => {
  const dispatch = useDispatch();
  const { symbols, lastSymbols, searchTime } = useSelector((state) => {
    const map = state[namespace];
    return {
      lastSymbols: map.lastSymbols,
      symbols: map.symbols,
      searchTime: map.searchTime,
    };
  });

  useEffect(() => {
    const handle = (socketData) => {
      const { data, searchData } = getStore().getState()[namespace];
      const oriData = cloneDeep(data);
      const searchAllData = cloneDeep(searchData);
      const spotSearchAllData = searchAllData[BUSINESS_ENUM.SPOT]?.data || [];
      const marginSearchAllData = searchAllData[BUSINESS_ENUM.MARGIN]?.data || [];
      const futuresSearchAllData = searchAllData[BUSINESS_ENUM.FUTURES]?.data || [];
      let isSearchUpdate = false;
      let isDataUpdate = false;
      forEach(socketData, (socketItem) => {
        const { topic, data: outerData } = socketItem;
        // 现货
        if (/market\/snapshot/.test(topic)) {
          const { lastTradedPrice: lastTradePrice, symbolCode, changeRate } = outerData.data;
          // 现货列表
          const indexSpot = findIndex(
            oriData,
            ({ symbolCode: tgtSymbolCode }) => tgtSymbolCode === symbolCode,
          );
          // 匹配命中
          if (indexSpot !== -1) {
            oriData[indexSpot].lastTradePrice = lastTradePrice;
            oriData[indexSpot].changeRate24h = changeRate;
            isDataUpdate = true;
          }

          // 现货全部搜索
          const indexSearchSpot = findIndex(
            spotSearchAllData,
            ({ symbolCode: tgtSymbolCode }) => tgtSymbolCode === symbolCode,
          );
          // 匹配命中
          if (indexSearchSpot !== -1) {
            spotSearchAllData[indexSearchSpot].lastTradePrice = lastTradePrice;
            spotSearchAllData[indexSearchSpot].changeRate24h = changeRate;
            isSearchUpdate = true;
          }

          // 杠杠全部搜索
          const indexSearchMargin = findIndex(
            marginSearchAllData,
            ({ symbolCode: tgtSymbolCode }) => tgtSymbolCode === symbolCode,
          );
          // 匹配命中
          if (indexSearchMargin !== -1) {
            marginSearchAllData[indexSearchMargin].lastTradePrice = lastTradePrice;
            marginSearchAllData[indexSearchMargin].changeRate24h = changeRate;
            isSearchUpdate = true;
          }
        } else {
          const { lastPrice: kumexLP, symbol, priceChgPct } = outerData;
          const index = findIndex(oriData, ({ symbolCode }) => {
            return symbol === symbolCode;
          });
          // 匹配命中
          if (index !== -1) {
            oriData[index].lastTradePrice = kumexLP;
            oriData[index].changeRate24h = priceChgPct;
            isDataUpdate = true;
          }

          const indexSearchFutures = findIndex(futuresSearchAllData, ({ symbolCode }) => {
            return symbol === symbolCode;
          });
          // 匹配命中
          if (indexSearchFutures !== -1) {
            futuresSearchAllData[indexSearchFutures].lastTradePrice = kumexLP;
            futuresSearchAllData[indexSearchFutures].changeRate24h = priceChgPct;
            isSearchUpdate = true;
          }
        }
      });
      const payload = {};
      if (isDataUpdate) {
        payload.data = oriData;
      }
      if (isSearchUpdate) {
        payload.searchData = searchAllData;
      }
      dispatch({
        type: `${namespace}/update`,
        payload,
      });
    };
    event.on(MARKET_SOCKET_EVENT, handle);
    return () => {
      event.off(MARKET_SOCKET_EVENT);
    };
  }, [dispatch]);

  // 常规列表的订阅逻辑
  useEffect(() => {
    if (lastSymbols && lastSymbols.length > 0) {
      const lastType = checkType(lastSymbols);
      unSubscribe(lastType, lastSymbols);
    }
    if (symbols && symbols.length > 0) {
      const type = checkType(symbols);
      subscribe(type, symbols);
    }
  }, [lastSymbols, symbols]);

  // 列表全部搜索订阅
  useEffect(() => {
    const { searchData: searchAll } = getStore().getState()[namespace];
    const spotSymbols = getSymbolsByData(searchAll[BUSINESS_ENUM.SPOT].data);
    let marginSymbols = [];
    let futureSymbols = [];
    if (isDisplayMargin()) {
      marginSymbols = getSymbolsByData(searchAll[BUSINESS_ENUM.MARGIN].data);
    }
    if (isDisplayFutures()) {
      futureSymbols = getSymbolsByData(searchAll[BUSINESS_ENUM.FUTURES].data);
    }
    const spotTypeSymbols = spotSymbols.concat(marginSymbols);
    if (spotTypeSymbols.length > 0) {
      subscribe('spot', spotTypeSymbols);
    }
    if (futureSymbols.length > 0) {
      subscribe('futures', futureSymbols);
    }
    return () => {
      if (spotTypeSymbols.length > 0) {
        unSubscribe('spot', spotTypeSymbols);
      }
      if (futureSymbols.length > 0) {
        unSubscribe('futures', futureSymbols);
      }
    };
  }, [searchTime]);
};
