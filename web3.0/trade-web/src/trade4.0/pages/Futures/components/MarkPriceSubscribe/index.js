/**
 * Owner: garuda@kupotech.com
 * 标记价格的订阅逻辑，每次触发 debounce 1s 后执行
 */
import React, { memo, useRef, useCallback, useEffect, useMemo } from 'react';
import { isEqual, forEach, debounce } from 'lodash';
import { useSelector } from 'react-redux';

import { FUTURES } from '@/meta/const';

import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useTradeType } from '@/hooks/common/useTradeType';

import workerSocket from 'common/utils/futuresSocketProcess';

const prefixTopic = '/contract/instrument';
const PositionSymbolAndCurrentSymbolSubscribe = memo(() => {
  const symbolsMap = useRef({});
  const subscribeSymbols = useRef(null);
  const prevSubscribeSymbols = useRef(null);

  const currentSymbol = useGetCurrentSymbol();

  // 遍历仓位，得到自有资金仓位的 symbol array
  const positionSymbols = useSelector((state) => {
    const symbols = [];
    forEach(state?.futures_orders?.positions, (item) => {
      if (item.isOpen) {
        symbols.push(item.symbol);
      }
    });
    return symbols;
  }, isEqual);

  // 走订阅逻辑
  const makeSymbolSubscribe = useCallback(
    debounce((symbols) => {
      // 如果订阅的是 ALL 了，或者 symbols 不存在，则不走后续逻辑
      if (subscribeSymbols.current === 'ALL' || !symbols) return;
      // 如果是 string 直接赋值
      if (typeof symbols === 'string') {
        symbolsMap.current[symbols] = '1';
      } else {
        forEach(symbols, (itemSymbol) => {
          symbolsMap.current[itemSymbol] = '1';
        });
      }
      const symbolsMapKey = Object.keys(symbolsMap.current);
      // 当遍历累计值 >= 80 的时候，判断一下上次订阅值是否存在，存在则取消订阅，将 subscribeSymbols 赋值为 ALL
      if (symbolsMapKey?.length >= 80) {
        if (prevSubscribeSymbols.current) {
          console.log('unsubscribe --->');
          workerSocket.unsubscribe(`${prefixTopic}:${prevSubscribeSymbols.current}`, false);
        }
        subscribeSymbols.current = 'ALL';
      } else {
        subscribeSymbols.current = symbolsMapKey.join(',');
      }
      // 如果跟上次值不一致，则走一遍订阅
      if (prevSubscribeSymbols.current !== subscribeSymbols.current) {
        console.log('subscribe --->', `${prefixTopic}:${subscribeSymbols.current}`);
        workerSocket.subscribe(`${prefixTopic}:${subscribeSymbols.current}`, false);
        prevSubscribeSymbols.current = subscribeSymbols.current;
      }
    }, 1000),
    [],
  );

  // 当前 symbol 变动，当前 仓位 变动，走一次标记价格的订阅触发
  useEffect(() => {
    const makeSymbols = [];
    if (currentSymbol) {
      makeSymbols.push(currentSymbol);
    }
    if (positionSymbols && positionSymbols.length) {
      makeSymbols.push(...positionSymbols);
    }
    if (makeSymbols.length) {
      makeSymbolSubscribe(makeSymbols);
    }
  }, [makeSymbolSubscribe, positionSymbols, currentSymbol]);

  return null;
});

const MarkPriceSubscribe = () => {
  const tradeType = useTradeType();
  const currentSymbol = useGetCurrentSymbol();
  const isFutures = useMemo(() => tradeType === FUTURES, [tradeType]);

  // 不是合约交易页面或者symbol 没初始化先不走
  if (!isFutures || !currentSymbol) return null;

  return <PositionSymbolAndCurrentSymbolSubscribe />;
};

export default memo(MarkPriceSubscribe);
