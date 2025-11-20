/**
 * Owner: garuda@kupotech.com
 * 该 hooks 返回所有合约交易对信息
 */
import { useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { find, get, isEqual } from 'lodash';
import { getStore } from 'src/utils/createApp';

export { useGetBuySell1 } from '@/pages/Orderbook/hooks/useModelData';

const getState = (name) => getStore().getState().futuresMarket[name] || {};

// 获取标记价格hooks
export const useMarkPrice = (symbol) => {
  return useSelector((state) => state.futuresMarket.MPDict[symbol] || 0, isEqual);
};

// 获取标记价格
export const getMarkPrice = (symbol) => {
  return getState('MPDict')[symbol] || 0;
};

// 获取指数价格hooks
export const useIndexPrice = (symbol) => {
  return useSelector((state) => state.futuresMarket.IPDict[symbol] || 0, isEqual);
};

// 获取指数价格
export const getIndexPrice = (symbol) => {
  return getState('IPDict')[symbol] || '0';
};

// 获取最新价格hooks
export const useLastPrice = (symbol) => {
  const detail = useMarketInfoForSymbol(symbol);
  return get(detail, 'lastPrice', '0');
};

// // 获取最新价格
// export const getLastPrice = (symbol) => {
//   return getState('LPDict')[symbol] || '0';
// };

// 获取 marketInfo 对应的 Symbol Detail
export const useMarketInfoForSymbol = (symbol = 'XBTUSDTM') => {
  const currentInfo = useRef(null);
  const sortedMarkets = useSelector((state) => state.futuresMarket.sortedMarkets);

  const findCurrentMarketInfo = find(sortedMarkets, (item) => item.symbol === symbol);

  if (!isEqual(currentInfo.current, findCurrentMarketInfo)) {
    currentInfo.current = findCurrentMarketInfo;
    return findCurrentMarketInfo;
  }
  return currentInfo.current;
};

// 获取最新价格hooks
export const getLastPrice = (symbol) => {
  const detail = getMarketInfoForSymbol(symbol);
  return get(detail, 'lastPrice', '0');
};

// 静态获取行情数据
export const getMarketInfoForSymbol = (symbol = 'XBTUSDTM') => {
  const globalState = getStore().getState();
  const sortedMarkets = get(globalState, `futuresMarket.sortedMarkets`, []);
  const ret = find(sortedMarkets, (item) => item.symbol === symbol);
  return ret || {};
};

// 获取最佳行情
export const usePullBestTicker = () => {
  const dispatch = useDispatch();

  const pullBestTicker = useCallback(
    (symbol) => {
      dispatch({
        type: 'futuresMarket/getBestTicker',
        payload: {
          symbol,
        },
      });
    },
    [dispatch],
  );

  return pullBestTicker;
};

export const useGetBestTicker = () => {
  const bestInfo = useSelector((state) => {
    return {
      ask1: get(state.futuresMarket, 'bestInfo.bestAskPrice', 0),
      bid1: get(state.futuresMarket, 'bestInfo.bestBidPrice', 0),
    };
  }, isEqual);
  return bestInfo;
};

export const getBestTicker = () => {
  const bestInfo = getState('bestInfo');
  return {
    ask1: bestInfo?.bestAskPrice || 0,
    bid1: bestInfo?.bestBidPrice || 0,
  };
};

export const useGetBestTickerForSymbol = (symbol) => {
  const bestInfo = useSelector((state) => {
    return {
      ask1: get(state.futuresMarket.bestInfoMap, `${symbol}.bestAskPrice`, 0),
      bid1: get(state.futuresMarket.bestInfoMap, `${symbol}.bestBidPrice`, 0),
    };
  }, isEqual);
  return bestInfo;
};

// 低频率获取最佳行情
export const getBestTickerForSymbol = (symbol) => {
  return getState((state) => {
    return {
      ask1: get(state.futuresMarket.bestInfoMap, `${symbol}.bestAskPrice`, 0),
      bid1: get(state.futuresMarket.bestInfoMap, `${symbol}.bestBidPrice`, 0),
    };
  });
};
