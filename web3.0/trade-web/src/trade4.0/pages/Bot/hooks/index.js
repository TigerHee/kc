/**
 * Owner: mike@kupotech.com
 */

import { getSymbolName as getFutureSymbolName } from './useFutureSymbolInfo';
import { getSymbolName as getSpotSymbolName, getCurrencyName } from './useSpotSymbolInfo';
import { isFutureSymbol } from 'Bot/helper';

// type Currency = string; // KCS
// type FutureSymbolCode = string; // ETHUSDTM
// type SpotSymbolCode = string; // BTC-USDT
// type ShowName = Currency | FutureSymbolCode | SpotSymbolCode;

/**
 * @description: 获取合约、现货交易对、单个币种的展示名字
 * @param {} showName
 * @return {*}
 */
export const getSymbolName = (showName) => {
  if (isFutureSymbol(showName)) {
    return getFutureSymbolName(showName);
  } else if (!showName.includes('-')) {
    return getCurrencyName(showName);
  }
  return getSpotSymbolName(showName);
};
/**
 * @description: 批量获取名字
 * @param {} showNames
 * @return {*}
 */
export const getSymbolNames = (showNames) => {
  if (!Array.isArray(showNames)) return '';
  return showNames.map((showName) => getSymbolName(showName)).join('、');
};
