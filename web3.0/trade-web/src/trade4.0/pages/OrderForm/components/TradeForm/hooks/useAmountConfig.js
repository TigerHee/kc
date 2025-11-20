/*
 * @owner: borden@kupotech.com
 */
import { useMemo } from 'react';
import {
  useGetCurrentSymbolInfo,
  getSymbolConfig,
} from '@/hooks/common/useSymbol';
import useSide from '../../../hooks/useSide';
import { TRADE_SIDE_MAP } from '../../../config';
import useOrderType, { getOrderType } from '../../../hooks/useOrderType';

const KEYS = {
  amountMin: ['baseMinSize', 'quoteMinSize', 'quoteStep'],
  amountMax: ['baseMaxSize', 'quoteMaxSize'],
};

export default function useAmountConfig() {
  const { isMarket } = useOrderType();
  const { side } = useSide();
  const currentSymbolInfo = useGetCurrentSymbolInfo();

  const isBuy = side === TRADE_SIDE_MAP.buy.value;
  const isMarketBuy = isBuy && isMarket;

  return useMemo(() => {
    const result = {};
    const coinName = isMarketBuy ? 'quote' : 'base';
    ['amountMax', 'amountMin'].forEach((v) => {
      let key = KEYS[v][0];
      if (isMarketBuy) {
        key = KEYS[v][1];
        if (!currentSymbolInfo[key] && KEYS[v][2]) {
          key = KEYS[v][2];
        }
      }
      result[v] = currentSymbolInfo[key] || 0;
    });
    result.amountUnit = currentSymbolInfo[`${coinName}Currency`];
    result.amountPrecision = currentSymbolInfo[`${coinName}Precision`];
    result.amountIncrement = currentSymbolInfo[`${coinName}Increment`];
    return result;
  }, [currentSymbolInfo, isMarketBuy]);
}
/**
 *
 * @param {*} side 默认sell
 * @param {*} symbol 默认当前交易对
 * @param {*} orderType 默认当前orderType
 * @returns
 */
export function getAmountConfig({ side, symbol, orderType }) {
  const { isMarket } = getOrderType(orderType);
  const symbolConfig = getSymbolConfig(symbol);

  const isBuy = side === TRADE_SIDE_MAP.buy.value;
  const isMarketBuy = isBuy && isMarket;

  const result = {};
  const coinName = isMarketBuy ? 'quote' : 'base';
  ['amountMax', 'amountMin'].forEach((v) => {
    let key = KEYS[v][0];
    if (isMarketBuy) {
      key = KEYS[v][1];
      if (!symbolConfig[key] && KEYS[v][2]) {
        key = KEYS[v][2];
      }
    }
    result[v] = symbolConfig[key] || 0;
  });
  result.amountUnit = symbolConfig[`${coinName}Currency`];
  result.amountPrecision = symbolConfig[`${coinName}Precision`];
  result.amountIncrement = symbolConfig[`${coinName}Increment`];
  return result;
}
