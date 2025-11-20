/*
 * @owner: Clyne@kupotech.com
 */
import { concatPath } from 'src/helper';
import { FUTURES, ISOLATED, MARGIN, SPOT } from '@/meta/const';
import { getStore } from 'src/utils/createApp';
import { getFuturesSymbols, transformSymbolInfo } from '@/hooks/common/useSymbol';
import { isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';

const getCurrencyBySymbol = (symbol) => {
  const [baseCurrency, quoteCurrency] = symbol.split('-');
  return { baseCurrency, quoteCurrency };
};

export const futuresSymbolIsActive = ({ status }) => {
  return status && status !== 'Closed';
};

// 根据现货交易对获取合约symbolInfo
const getFuturesSymbolBySpotSymbol = (symbol) => {
  const symbolsMap = getFuturesSymbols();
  const { baseCurrency: base, quoteCurrency: quote } = getCurrencyBySymbol(symbol);
  // eslint-disable-next-line guard-for-in
  for (const symbolKey in symbolsMap) {
    const info = transformSymbolInfo(symbolsMap[symbolKey] || {});
    const { baseCurrency, quoteCurrency } = info;
    if (baseCurrency === base && quoteCurrency === quote && futuresSymbolIsActive(info)) {
      return info;
    }
  }
  return transformSymbolInfo(symbolsMap.XBTUSDTM);
};

/**
 * 根据合约symgbolInfo拼接现货杠杠交易对
 */
const getSpotSymbolByFuturesSymbol = (symbolInfo) => {
  const { baseCurrency, quoteCurrency, isInverse } = symbolInfo;
  const quote = isInverse ? 'USDT' : quoteCurrency;
  return `${baseCurrency}-${quote}`;
};

const getMarginSymbols = (data) => {
  const isolatedSymbols = [];
  const marginSymbols = [];
  // eslint-disable-next-line guard-for-in
  for (const symbol in data) {
    const item = data[symbol];
    if (item.isIsolatedEnabled) {
      isolatedSymbols.push(item);
    }
    if (item.isMarginEnabled) {
      marginSymbols.push(item);
    }
  }
  return { isolatedSymbols, marginSymbols };
};

/**
 * 根据合约交易对获取现货杠杠symbol
 **/
const getMarginSymbolByFuturesSymbol = (tradeType, futuresSymbol) => {
  const { marginSymbolsMap } = getStore().getState().symbols;
  const { isolatedSymbols, marginSymbols } = getMarginSymbols(marginSymbolsMap);
  const marginSymbolList = tradeType === ISOLATED ? isolatedSymbols : marginSymbols;
  const symbolsMap = getFuturesSymbols();
  const defaultFuturesSymbol = transformSymbolInfo(symbolsMap.XBTUSDTM || {});
  let spotSymbol = getSpotSymbolByFuturesSymbol(defaultFuturesSymbol);
  // 查找对应合约symbolInfo，初始化现货交易对
  // eslint-disable-next-line guard-for-in
  for (const symbolKey in symbolsMap) {
    const info = transformSymbolInfo(symbolsMap[symbolKey]);
    const itemSpotSymbol = info.symbol;
    if (futuresSymbol === itemSpotSymbol) {
      spotSymbol = getSpotSymbolByFuturesSymbol(info);
      break;
    }
  }
  let matchRet = 'BTC-USDT';
  // 匹配杠杠symbolList是否支持
  for (let i = 0; i < marginSymbolList.length; i++) {
    const item = marginSymbolList[i];
    // 这里有点奇葩这个数据结构
    const _symbol = item.symbol;
    if (_symbol === spotSymbol) {
      matchRet = _symbol;
      break;
    }
  }
  return matchRet;
};

/**
 * 获取合约path
 */
export const getFuturesPath = (symbol) => {
  if (!symbol) {
    return {};
  }
  const isSpotSymbol = isSpotTypeSymbol(symbol);
  let matchRet = 'XBTUSDTM';
  // 现货交易对，找baseCurrency，quoteCurrency匹配的内容
  if (isSpotSymbol) {
    matchRet = getFuturesSymbolBySpotSymbol(symbol).symbol;
    // 合约交易对
  } else {
    matchRet = symbol;
  }
  return {
    tradeType: FUTURES,
    symbol: matchRet,
    path: concatPath(TRADE_TYPES_CONFIG[FUTURES].path, matchRet),
  };
};

/**
 * 获取杠杠path
 */
export const getMarginPath = (symbol, tradeType) => {
  if (tradeType !== ISOLATED && tradeType !== MARGIN) {
    return console.error(`Trade type error${symbol}`);
  }
  const { marginSymbolsMap } = getStore().getState().symbols;
  const { isolatedSymbols, marginSymbols } = getMarginSymbols(marginSymbolsMap);
  const symbolList = tradeType === ISOLATED ? isolatedSymbols : marginSymbols;
  const isSpotSymbol = isSpotTypeSymbol(symbol);
  let matchRet = 'BTC-USDT';
  // 现货交易对类型
  if (isSpotSymbol) {
    for (let i = 0; i < symbolList.length; i++) {
      const _symbol = symbolList[i].symbol;
      if (_symbol === symbol) {
        matchRet = _symbol;
        break;
      }
    }
    // 合约类型
  } else {
    matchRet = getMarginSymbolByFuturesSymbol(tradeType, symbol);
  }

  return {
    tradeType,
    symbol: matchRet,
    path: concatPath(TRADE_TYPES_CONFIG[tradeType].path, matchRet),
  };
};

/**
 * 获取现货path
 */
export const getSpotPath = (symbol) => {
  const isSpotSymbol = isSpotTypeSymbol(symbol);
  let matchRet = 'BTC-USDT';
  // 现货交易对
  if (isSpotSymbol) {
    matchRet = symbol;
  } else {
    matchRet = getFuturesSymbolBySpotSymbol(symbol).symbol;
  }

  return {
    tradeType: SPOT,
    symbol: matchRet,
    path: concatPath(TRADE_TYPES_CONFIG[SPOT].path, matchRet),
  };
};

/**
 *
 * @param {*} tradeType 交易类型
 * @param {*} symbol 交易对
 * @returns string
 */
export const getSymbolPath = (tradeType = TRADE_TYPES_CONFIG.TRADE.key, symbol = 'BTC-USDT') => {
  if (!TRADE_TYPES_CONFIG[tradeType]?.path) return '';
  if (tradeType === FUTURES) {
    return getFuturesPath(symbol);
  } else if (tradeType === ISOLATED || tradeType === MARGIN) {
    return getMarginPath(symbol, tradeType);
  } else {
    return getSpotPath(symbol);
  }
};
