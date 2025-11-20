/**
 * Owner: garuda@kupotech.com
 */
import { lessThanOrEqualTo, minus, multiply } from 'utils/operation';

const DEEP_OFFSET = 0.03; // 3%

// 校验是否深入买卖盘
export const validatorDeep = ({ values = {}, side, ask1, bid1 } = {}) => {
  const { price = 0 } = values;
  const basePrice = side === 'buy' ? price : -price;
  const rivalPrice = side === 'buy' ? ask1 : bid1 && -bid1;
  const offset = side === 'buy' ? 1 + DEEP_OFFSET : 1 - DEEP_OFFSET;

  if (!rivalPrice) {
    return false;
  }

  return lessThanOrEqualTo(minus(multiply(rivalPrice)(offset))(basePrice))(0);
};
