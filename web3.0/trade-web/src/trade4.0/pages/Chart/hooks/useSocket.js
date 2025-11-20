/**
 * Owner: jessie@kupotech.com
 */
import { useEffect, useMemo, useCallback, useRef } from 'react';
import { eachRight, map, find, debounce, each, filter } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import * as ws from '@kc/socket';
import workerSocket from 'common/utils/socketProcess';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import { useTransformAmount } from '@/hooks/futures/useUnit';
import { getStore } from 'src/utils/createApp';
import { FUTURES } from '@/meta/const';
import socketStore from 'pages/Trade3.0/stores/store.socket';
import { namespace } from '../config';
import {
  getListenerGUID,
  getSymbolTypeFromTopic,
  getIntervalSeconds,
} from '../components/TradingViewV24/utils';

let isMarketBind = false;

// 获取k线symbol行情数据(最新价、涨跌幅) socket
const symbolMarketsSocketHandle = ({ dispatch }) => {
  // kLineSymbols
  if (!isMarketBind) {
    workerSocket.marketSnapshotMessage((arr) => {
      window._x_topicTj('MARKET_SNAPSHOT', 'trade.snapshot', arr.length);
      const diffMap = {};
      // 后来的先覆盖
      eachRight(arr, (_message) => {
        const { data: { data } = {} } = _message;
        const { symbolCode } = data;
        if (!diffMap[symbolCode]) {
          diffMap[symbolCode] = data;
        }
      });
      /** update data */
      const kLineSymbols = getStore().getState()[namespace].kLineSymbols;
      const kLineTabsMarketMap = getStore().getState()[namespace].kLineTabsMarketMap;

      const newKLineTabsMarketMap = { ...kLineTabsMarketMap };
      let needUpdate = false;
      map(diffMap, (value, key) => {
        // 只更新kLineSymbols中包含的symbol, 避免不必要的渲染
        if (find(kLineSymbols, { symbol: key })) {
          needUpdate = true;
          newKLineTabsMarketMap[key] = diffMap[key];
        }
      });
      if (needUpdate) {
        dispatch({
          type: `${namespace}/update`,
          payload: {
            kLineTabsMarketMap: newKLineTabsMarketMap,
          },
        });
      }
    });

    isMarketBind = true;
  }
};

export const useMarketSocket = () => {
  const dispatch = useDispatch();
  const kLineSymbols = useSelector((state) => state[namespace].kLineSymbols);

  const [symbolListStr, futuresSymbolListStr] = useMemo(() => {
    const symbolList = [];
    const futuresSymbolList = [];

    map(kLineSymbols, (item) => {
      if (item?.tradeType === FUTURES) {
        futuresSymbolList.push(item.symbol);
      } else {
        symbolList.push(item.symbol);
      }
    });
    return [symbolList.toString(), futuresSymbolList.toString()];
  }, [kLineSymbols]);

  useEffect(() => {
    symbolMarketsSocketHandle({ dispatch });
  }, [dispatch]);

  useEffect(() => {
    // k线symbol行情
    const symbolList = symbolListStr?.split(',');
    const symbolMarketsTopic = ws.Topic.get(ws.Topic.MARKET_SNAPSHOT, {
      SYMBOLS: symbolList,
    });

    if (symbolListStr) {
      // 订阅
      workerSocket.subscribe(symbolMarketsTopic, false);
    }
    // 取消订阅;
    return () => {
      if (symbolListStr) {
        workerSocket.unsubscribe(symbolMarketsTopic, false);
      }
    };
  }, [symbolListStr]);

  // 合约拉取全量，无需特殊处理
  // TODO socket变化
  // useEffect(() => {
  //   // k线合约symbol行情
  //   const futuresSymbolList = futuresSymbolListStr?.split(',');
  //   const symbolMarketsTopic = ws.Topic.get(ws.Topic.MARKET_SNAPSHOT, {
  //     SYMBOLS: futuresSymbolList,
  //   });

  //   if (futuresSymbolListStr) {
  //     // 订阅
  //     workerSocket.subscribe(symbolMarketsTopic, false);
  //   }
  //   // 取消订阅;
  //   return () => {
  //     if (futuresSymbolListStr) {
  //       workerSocket.unsubscribe(symbolMarketsTopic, false);
  //     }
  //   };
  // }, [futuresSymbolListStr]);

  return { symbolListStr, futuresSymbolListStr };
};

/**
 *
 * 处理实时更新数据，与断连重新拉取数据
 * socket 数据结构
 *  arr => [
   {
      data: {
        "time": "3105804647429157", //获取时间
        "symbol": "BTC-USDT",
        "candles" : [
           "1545904980",             // Start time of the candle cycle
           "0.058",                  // opening price
           "0.049",                  // closing price
           "0.058",                  // highest price
           "0.049",                  // lowest price
           "0.018",                  // Transaction amount (unused)
           "0.000945"                // Transaction volume
        ],
      },
      ...
   },
 ]}
 */
export const useKlineSocket = ({
  tvWidget,
  datafeed,
  chartReady,
  symbol,
  interval,
  symbolStr,
  tradeType,
}) => {
  const { quantityToBaseCurrency } = useTransformAmount({ tradeType, symbol });

  const socketIdRef = useRef(-1);
  const serverTime = useSelector((state) => state.server_time.serverTime);
  const refreshCandles = socketStore.useSelector((state) => state.socket.refreshCandles);

  const candlesData = useMemo(() => {
    if (!refreshCandles?.length || !symbolStr) {
      return [];
    }
    return filter(refreshCandles, (item) => getSymbolTypeFromTopic(item?.topic) === symbolStr);
  }, [refreshCandles, symbolStr]);

  const guid = useMemo(() => {
    if (!symbol || !interval) {
      return '';
    }
    return getListenerGUID(symbol, interval, tradeType);
  }, [symbol, interval, tradeType]);

  // 重新请求数据
  const debounceReconnectLoad = useCallback(
    debounce(() => {
      const chart = tvWidget?.chart ? tvWidget.chart() : undefined;
      if (!guid || !chart || !datafeed || !chartReady) {
        return;
      }
      const onResetCallback = datafeed.onResetCacheNeededCallback
        ? datafeed.onResetCacheNeededCallback[guid]
        : undefined;
      if (typeof onResetCallback === 'function') {
        // 重新拉取k线全量history数据
        onResetCallback();
        chart.resetData();
      }
    }, 3000),
    [guid, datafeed, tvWidget, chartReady],
  );

  // 更新k线数据
  const onRealtimeCallback = useCallback(
    (arr) => {
      if (!guid || !datafeed || !chartReady) {
        return;
      }
      const onCallback = datafeed.onRealtimeCallback
        ? datafeed.onRealtimeCallback[guid]
        : undefined;
      if (typeof onCallback === 'function') {
        const [time, open, close, high, low, amount, volume] = arr;
        onCallback({
          time: parseFloat(time) * 1000,
          close: parseFloat(close),
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          volume: quantityToBaseCurrency(parseFloat(volume)),
        });
      }
    },
    [guid, chartReady, datafeed, quantityToBaseCurrency],
  );

  const socketReconnect = useCallback(async () => {
    const id =
      tradeType === FUTURES ? await futuresWorkerSocket.socketId() : await workerSocket.socketId();
    // socket断开重连拉取全量
    if (socketIdRef.current !== -1 && id !== socketIdRef.current) {
      socketIdRef.current = id;
      debounceReconnectLoad();
      return;
    }
    socketIdRef.current = id;
  }, [debounceReconnectLoad, tradeType]);

  // 预处理数据，包含断连判断与过期数据判断--需要重新拉取全量数据，正常数据更新到k线
  const dealData = useCallback(
    async (arr) => {
      socketReconnect();

      const diffTime = getIntervalSeconds(interval);
      const candlesMap = {};
      each(arr, ({ topic, data: { candles } }) => {
        const st = getSymbolTypeFromTopic(topic);
        if (!candlesMap[st]) {
          candlesMap[st] = {};
        }

        const time = candles[0];
        if (serverTime - diffTime - 1000 < time * 1000) {
          // 更新数据
          candlesMap[st][time] = candles;
          onRealtimeCallback(candles);
        } else {
          // 过期数据处理
          debounceReconnectLoad();
        }
      });
    },
    [interval, serverTime, debounceReconnectLoad, onRealtimeCallback, socketReconnect],
  );

  useEffect(() => {
    if (socketReconnect) {
      socketReconnect();
    }
  }, [socketReconnect]);

  useEffect(() => {
    if (dealData && candlesData?.length) {
      dealData(candlesData);
    }
  }, [candlesData, dealData]);
};
