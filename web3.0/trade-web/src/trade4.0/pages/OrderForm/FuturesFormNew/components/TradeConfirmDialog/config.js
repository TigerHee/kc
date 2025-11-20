/**
 * Owner: garuda@kupotech.com
 */
import { lessThanOrEqualTo, greaterThanOrEqualTo, minus, multiply, abs } from '../../builtinCommon';
import { getBBO, getMarkPrice, getSymbolInfo } from '../../hooks/useGetData';

const DEEP_OFFSET = 0.03; // 3%

// 校验是否深入买卖盘
export const validatorDeep = ({ values = {} } = {}) => {
  const { price = 0 } = values;
  const { ask1, bid1 } = getBBO();
  const isBuy = values?.side === 'buy';
  const basePrice = isBuy ? price : -price;
  const rivalPrice = isBuy ? ask1 : bid1 && -bid1;
  const offset = isBuy ? 1 + DEEP_OFFSET : 1 - DEEP_OFFSET;

  if (!rivalPrice || !basePrice) {
    return false;
  }

  return lessThanOrEqualTo(minus(multiply(rivalPrice)(offset))(basePrice))(0);
};

// 校验是否价差过大
export const validatorPriceGap = ({ values = {} } = {}) => {
  const { leverage = 1 } = values;
  const markPrice = getMarkPrice();
  const { ask1, bid1 } = getBBO();
  const { symbolInfo: { maintainMargin } = {} } = getSymbolInfo();
  const price = values?.side === 'buy' ? ask1 : bid1;
  return (
    greaterThanOrEqualTo(leverage)(10) &&
    greaterThanOrEqualTo(abs(minus(price)(markPrice)))(multiply(markPrice)(maintainMargin))
  );
};

export const STOP_PRICE_TYPE_TEXT = {
  TP: 'trade.order.lastPrice',
  MP: 'refer.markPrice',
  IP: 'trade.order.indexPrice',
};
