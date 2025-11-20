import {getDigit} from './helper';
import {toNonExponential} from './operation';
/**
 * Owner: garuda@kupotech.com
 * 该 hooks 返回所有合约交易对信息
 */

/**
 * 将XBT转换为BTC
 */
export const formatCurrency = currency => {
  if (currency === 'XBT') {
    return 'BTC';
  }
  return currency;
};

// 转换函数
export const transformSymbolInfo = info => {
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
    indexPricePrecision: isSpot
      ? pricePrecision
      : getDigit(_indexPriceTickSize),
    basePrecision: isSpot
      ? getDigit(baseIncrement, true)
      : getDigit(multiplier, true),
  };
};
