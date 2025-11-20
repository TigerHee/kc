/*
 * owner: Clyne@kupotech.com
 */
import { useGetCurrentSymbol, useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import { useTradeType } from '@/hooks/common/useTradeType';
import { getSymbolAuctionInfo } from '@/utils/business';
import * as ws from '@kc/socket';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import workerSocket, { PushConf } from 'common/utils/socketProcess';
import { useDispatch, useSelector } from 'dva';
import React, { useEffect } from 'react';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';
import { FUTURES } from 'src/trade4.0/meta/const';
import useEtfCoin from 'utils/hooks/useEtfCoin';
import { namespace, orderbooksLoop } from '../config';
import { getRequestPrecision } from '../utils/format';

const futuresTopic = (symbol) => {
  return `/contractMarket/level2Depth50:${symbol}`;
};
export const useSocket = () => {
  const currencyCode = useEtfCoin();
  const currentDepth = useSelector((state) => state[namespace].currentDepth);
  const symbolsMap = useSelector((state) => state.symbols.symbolsMap);
  const auctionWhiteAllowList = useSelector((state) => state.callAuction.auctionWhiteAllowList);
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
  );
  const coinPair = currentSymbol;
  const currentSymbol = useGetCurrentSymbol();
  const tradeType = useTradeType();
  const isSpotSymbol = isSpotTypeSymbol(currentSymbol);

  const { showAuction } = getSymbolAuctionInfo(
    symbolsMap?.[coinPair],
    auctionWhiteAllowList,
    auctionWhiteAllowStatusMap,
  );

  useEffect(() => {
    if (currentDepth && currentSymbol && tradeType !== FUTURES && isSpotSymbol) {
      const precision = getRequestPrecision(currentDepth);
      // 集合竞价买卖盘
      const auctionOrderBookTopic = ws.Topic.get(PushConf.OPENPRDERSAuctionLimit50.topic, {
        SYMBOLS: [currentSymbol],
      });
      // 集合竞价买卖盘和正常的买卖盘互斥
      // 买卖盘
      const orderBookTopic = showAuction
        ? auctionOrderBookTopic
        : ws.Topic.get('/spotMarket/level2Depth50:{SYMBOL_LIST}', {
            SYMBOLS: [`${currentSymbol}_${precision}`],
          });
      // 净值
      const netAssetsTopic = ws.Topic.get('/margin-fund/nav:{SYMBOL_LIST}', {
        SYMBOLS: [currencyCode],
      });
      // 订阅
      workerSocket.subscribe(orderBookTopic, false);
      if (currencyCode) {
        workerSocket.subscribe(netAssetsTopic, false);
      }
      // 取消订阅;
      return () => {
        if (currentDepth && currentSymbol && tradeType !== FUTURES && isSpotSymbol) {
          workerSocket.unsubscribe(orderBookTopic, false);
          if (currencyCode) {
            workerSocket.unsubscribe(netAssetsTopic, false);
          }
        }
      };
    }
  }, [currencyCode, currentSymbol, currentDepth, showAuction, tradeType, isSpotSymbol]);

  // 合约推送
  useEffect(() => {
    if (tradeType === FUTURES && currentSymbol) {
      const topic = futuresTopic(currentSymbol);
      futuresWorkerSocket.subscribe(topic, false);
      return () => {
        futuresWorkerSocket.unsubscribe(topic, false);
      };
    }
  }, [tradeType, currentSymbol]);
};

export const useCheckSocket = () => {
  const dispatch = useDispatch();
  const { baseIncrement } = useGetCurrentSymbolInfo();
  const currentSymbol = useGetCurrentSymbol();
  const currentDepth = useSelector((state) => state[namespace].currentDepth);
  const depthConfig = useSelector((state) => state[namespace].depthConfig);
  const baseCurrency = useSelector((state) => state[namespace].baseCurrency);
  const quoteCurrency = useSelector((state) => state[namespace].quoteCurrency);

  useEffect(() => {
    if (baseIncrement && baseCurrency && quoteCurrency && currentDepth) {
      const payload = {
        currentSymbol,
        currentDepth,
        depthConfig,
        tickSize: baseIncrement,
      };

      const timer = setTimeout(() => {
        dispatch({
          type: `${namespace}/checkSocket@polling`,
          payload,
        });
      }, orderbooksLoop);

      return () => {
        clearTimeout(timer);
        dispatch({
          type: `${namespace}/checkSocket@polling:cancel`,
        });
      };
    }
  }, [
    quoteCurrency,
    baseCurrency,
    baseIncrement,
    currentDepth,
    dispatch,
    currentSymbol,
    depthConfig,
  ]);
};
