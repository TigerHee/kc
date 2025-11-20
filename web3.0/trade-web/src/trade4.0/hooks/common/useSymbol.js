/**
 * Owner: borden@kupotech.com
 */
import { useMemo } from 'react';
import { useSelector } from 'dva';
import { getStore } from 'src/utils/createApp';
import { getTradeType, useTradeType } from '@/hooks/common/useTradeType';
import { FUTURES } from '@/meta/const';
import { formatCurrency } from '@/utils/futures/formatCurrency';
import { get, isEqual } from 'lodash';
import { getDigit, toNonExponential } from 'helper';

const _noop = {};
const _arr = [];

export const useGetCurrentSymbol = () => {
  return useSelector((state) => state.trade.currentSymbol);
};

export const getCurrentSymbol = () => {
  return getStore().getState().trade.currentSymbol;
};

export const useIsHasCurrentSymbolInfo = () => {
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const tradeType = useTradeType();
  const dict = useSelector((state) => {
    // 合约扩展
    if (tradeType === FUTURES) {
      return state.symbols.futuresSymbolsMap;
    } else {
      return state.symbols.symbolsMap;
    }
  });
  return !!dict[currentSymbol];
};

export const useGetCurrentSymbolInfo = () => {
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const tradeType = useTradeType();
  return useSelector((state) => {
    const dataKey = tradeType === FUTURES ? 'futuresSymbolsMap' : 'symbolsMap';
    const info = get(state.symbols, dataKey, _noop);
    return info[currentSymbol] || _noop;
  });
  // return transformSymbolInfo(info[currentSymbol] || _noop);
};

export const getSymbolConfig = (symbol) => {
  if (!symbol) {
    symbol = getCurrentSymbol();
  }
  const dict = getStore().getState().symbols.symbolsMap;
  return dict[symbol] || {};
};

/**
 * 通过 symbol 获取交易对信息,0726换了名字
 * @param {string} symbol
 */
export const useGetSymbolInfo = ({ symbol, tradeType }) => {
  return useSelector((state) => {
    const dataKey = tradeType === FUTURES ? 'futuresSymbolsMap' : 'symbolsMap';
    const info = get(state.symbols, dataKey, _noop);
    return info[symbol] || _noop;
  }, isEqual);
  // return transformSymbolInfo(info[symbol] || _noop);
};

export const useGetMarginSymbolInfo = ({ symbol }) => {
  const dict = useSelector((state) => state.symbols.marginSymbolsMap);
  return dict[symbol] || _noop;
  // return transformSymbolInfo(dict[symbol] || _noop);
};

// ==================== 合约新增函数 ====================
/**
 * 获取symbolInfo
 */
export const getSymbolInfo = ({ symbol, tradeType }) => {
  const state = getStore().getState();
  const spotDict = state.symbols.symbolsMap || _noop;
  const futureDict = getFuturesSymbols();
  const ret = tradeType === FUTURES ? futureDict : spotDict;
  // return transformSymbolInfo(ret[symbol] || _noop);
  return ret[symbol] || _noop;
};

/**
 * 获取当前交易对
 */
export const getCurrentSymbolInfo = () => {
  const currentSymbol = getCurrentSymbol();
  const tradeType = getTradeType();
  return getSymbolInfo({ symbol: currentSymbol, tradeType });
};

// 返回低频更新对象
export const getFuturesSymbols = () => {
  const globalState = getStore().getState();
  const futuresSymbolsMap = get(globalState, 'symbols.futuresSymbolsMap');

  return futuresSymbolsMap || {};
};

export const getFuturesSymbolList = () => {
  const globalState = getStore().getState();
  const futuresSymbols = get(globalState, 'symbols.futuresSymbols');

  return futuresSymbols || _arr;
};

export const useFuturesSymbols = () => {
  const futuresSymbolsMap = useSelector((state) => state.symbols.futuresSymbolsMap);

  return futuresSymbolsMap || _noop;
};

/**
 * 获取全仓合约配置
 * f 配置的调整系数，会影响初始保证金率 max 的取值，风控因子，默认值 1.3
 * k 合约交易对配置常量，控制交易对最大可开的绝对数量
 * m 合约交易对配置常量，最大风险限额等级下的最大可开，会影响维持保证金率计算
 * mmrLimit 配置的调整系数，用来做 维持保证金率的上限，默认值 0.3
 * */
export const useFuturesCrossConfigForSymbol = ({ symbol }) => {
  const {
    k,
    m,
    f = 1.3,
    mmrLimit = 0.3,
    mmrLevConstant = 10,
  } = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  return {
    f,
    k,
    m,
    mmrLimit,
    mmrLevConstant,
  };
};

export const getFuturesCrossConfigForSymbol = ({ symbol }) => {
  const {
    k,
    m,
    f = 1.3,
    mmrLimit = 0.3,
    mmrLevConstant = 10,
  } = getSymbolInfo({ symbol, tradeType: FUTURES });
  return {
    f,
    k,
    m,
    mmrLimit,
    mmrLevConstant,
  };
};

// FIXME: 预留一个方法，后续可配置调整这里
export const getFuturesCrossBuffer = () => {
  return 0.998;
};

// 转换函数
export const transformSymbolInfo = (info) => {
  const {
    indexPriceTickSize = 1,
    tickSize,
    priceIncrement,
    multiplier,
    baseIncrement,
    lotSize,
    isInverse,
    baseCurrency,
    quoteCurrency,
    settleCurrency,
    pricePrecision,
  } = info || {};
  // 现货，杠杆没有正反向，用这个字段来判断类型
  const isSpot = isInverse === undefined;
  const futuresMinQty = isInverse ? lotSize : multiplier;
  const _priceIncrement = toNonExponential(isSpot ? priceIncrement : tickSize);
  const _indexPriceTickSize = toNonExponential(indexPriceTickSize);
  return {
    ...info,
    tickSize: toNonExponential(tickSize),
    indexPriceTickSize: _indexPriceTickSize,
    // btc-usdt举例
    // usdt价格最小值
    priceIncrement: _priceIncrement,
    // BTC最小值
    baseIncrement: toNonExponential(isSpot ? baseIncrement : futuresMinQty),
    // 特殊处理合约XBT
    baseCurrency: isSpot ? baseCurrency : formatCurrency(baseCurrency),
    quoteCurrency: isSpot ? quoteCurrency : formatCurrency(quoteCurrency),
    settleCurrency: isSpot ? settleCurrency : formatCurrency(settleCurrency),
    pricePrecision: isSpot ? pricePrecision : getDigit(_priceIncrement),
    indexPricePrecision: isSpot ? pricePrecision : getDigit(_indexPriceTickSize),
    basePrecision: isSpot ? getDigit(baseIncrement, true) : getDigit(multiplier, true),
  };
};
