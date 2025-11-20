/**
 * Owner: garuda@kupotech.com
 */
import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get, isEqual, find } from 'lodash';

import { FUTURES } from '@/meta/const';
import { KLINE_INDEX, KLINE_LAST, KLINE_MARK } from '@/meta/chart';
import storage from 'utils/storage';
import { getStore } from 'utils/createApp';

import { getSymbolInfo, getFuturesSymbols, useGetSymbolInfo } from '@/hooks/common/useSymbol';

import { KLINE_LOCAL_PRICE_TYPE, getReplaceIndexSymbol } from './config';

// 获取priceKey
export const makeSymbolPriceKey = ({ symbol, priceType, symbolInfo, tradeType }) => {
  // 如果是合约的逻辑
  if (tradeType === FUTURES) {
    if (priceType === KLINE_LAST) {
      return symbol;
    } else if (priceType === KLINE_INDEX) {
      const indexSymbol = symbolInfo?.indexSymbol?.replace('.B', '.K');
      return indexSymbol;
    } else if (priceType === KLINE_MARK) {
      return `${symbol}_MARKPRICE`;
    }
  }
  return symbol;
};

// 获取 kline 价格指标
export const useKlinePriceType = (symbol) => {
  const currentPriceType = useSelector((state) => {
    const localePriceType = storage.getItem(KLINE_LOCAL_PRICE_TYPE);
    return get(state.$tradeKline, `priceType.${symbol}`, localePriceType?.[symbol] || KLINE_LAST);
  }, isEqual);

  return currentPriceType;
};

// 设置 kline 价格指标
export const useKlinePriceTypeFunc = () => {
  const dispatch = useDispatch();
  const priceType = useSelector((state) => state.$tradeKline.priceType);

  const onKlinePriceTypeChange = useCallback(
    (v, symbol) => {
      const updatePriceType = { ...priceType, [symbol]: v };
      dispatch({
        type: '$tradeKline/update',
        payload: {
          priceType: updatePriceType,
        },
      });

      // 设置本地存储
      storage.setItem(KLINE_LOCAL_PRICE_TYPE, updatePriceType);
    },
    [dispatch, priceType],
  );

  return onKlinePriceTypeChange;
};

// 获取 kline 对应symbol 的指标值
export const useKlinePriceKeyForSymbol = (symbol, paramsPriceType, tradeType = FUTURES) => {
  const symbolInfo = useGetSymbolInfo({ symbol, tradeType });
  const usePriceType = useKlinePriceType(symbol);

  const priceType = useMemo(() => {
    return paramsPriceType || usePriceType;
  }, [paramsPriceType, usePriceType]);

  return makeSymbolPriceKey({ symbol, symbolInfo, priceType, tradeType });
};

// 获取 kline 价格指标
export const getKlinePriceType = (symbol) => {
  const globalState = getStore().getState();
  const localePriceType = storage.getItem(KLINE_LOCAL_PRICE_TYPE);
  const priceType = get(
    globalState,
    `$tradeKline.priceType.${symbol}`,
    localePriceType?.[symbol] || KLINE_LAST,
  );
  return priceType;
};

// 获取 kline 对应symbol 的指标值
export const getKlinePriceKeyForSymbol = (symbol, paramsPriceType, tradeType = FUTURES) => {
  const priceType = paramsPriceType || getKlinePriceType(symbol);
  // 获取合约交易对
  const symbolInfo = getSymbolInfo({ symbol, tradeType });

  return makeSymbolPriceKey({ symbol, priceType, symbolInfo, tradeType });
};

// 获取 kline 其它指标对应的 symbol
export const getOriginSymbolForKlineSymbol = (klineSymbol) => {
  if (!klineSymbol) return klineSymbol;
  const symbolMap = getFuturesSymbols();
  if (klineSymbol.match(/\.K|\.B/)) {
    const currentSymbol = find(
      symbolMap,
      (item) => getReplaceIndexSymbol(item.indexSymbol) === getReplaceIndexSymbol(klineSymbol),
    )?.symbol;
    return currentSymbol;
  }
  if (klineSymbol.match('_MARKPRICE')) {
    const replaceSymbol = klineSymbol.replace('_MARKPRICE', '');
    return replaceSymbol;
  }
  return klineSymbol;
};
