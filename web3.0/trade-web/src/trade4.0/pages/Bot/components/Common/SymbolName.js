/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import * as Future from 'Bot/hooks/useFutureSymbolInfo.js';
import * as Spot from 'Bot/hooks/useSpotSymbolInfo.js';
import { isFutureSymbol } from 'Bot/helper';

/**
 * @description: 展示现货/合约symbolName
 * @return {*}
 */
export default ({ value: symbolCode }) => {
  if (!symbolCode) return null;
  return isFutureSymbol(symbolCode) ? (
    <Future.SymbolName value={symbolCode} />
  ) : (
    <Spot.SymbolName value={symbolCode} />
  );
};
