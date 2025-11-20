/**
 * Owner: garuda@kupotech.com
 */
import { plus, minus, equals, min, max, multiply } from './builtinCommon';

import { CALC_LIMIT, CALC_MARKET } from './config';

const RATIO = 0.01;

/**
 * 返回浮动比例
 * 反向合约 1 - RATIO
 * 正向合约 1 + RATIO
 */
export const calcRation = ({ isInverse }) => {
  return isInverse ? minus(1)(RATIO) : plus(1)(RATIO);
};

/**
 * 返回预计成交价
 * 正向合约：
 * 限价买入 - 委托价格 -- 不能超过最大价格
 * 限价卖出 - max(买1，委托价格)*1.01 -- 兜底兼容 买1 为0 的场景
 * 市价买入 - 卖1 * 1.01
 * 市价卖出 - 买1 * 1.01
 * =======
 * 反向合约：
 * 限价买入 - min(委托价格，卖1) * 0.99 -- 兜底兼容 卖1 为0 的场景
 * 限价卖出 - 委托价格 -- 不能超过最大价格
 * 市价买入 - 卖1 * 0.99
 * 市价卖出 - 买1 * 0.99
 */
export const calculatorDealPrice = ({ symbolInfo, type, price = 0, ask1 = 0, bid1 = 0 }) => {
  let buyMinPrice;
  let sellMinPrice;

  const { isInverse, maxPrice } = symbolInfo || {};
  const ration = calcRation({ isInverse });
  if (CALC_LIMIT.includes(type)) {
    const orderPrice = min(maxPrice, price || 0);
    if (isInverse) {
      buyMinPrice = multiply(equals(ask1)(0) ? orderPrice : min(orderPrice, ask1))(ration);
      sellMinPrice = orderPrice;
    } else {
      buyMinPrice = orderPrice;
      sellMinPrice = multiply(equals(bid1)(0) ? orderPrice : max(orderPrice, bid1))(ration);
    }
  } else if (CALC_MARKET.includes(type)) {
    buyMinPrice = multiply(ask1)(ration);
    sellMinPrice = multiply(bid1)(ration);
  }

  return [buyMinPrice.toString(), sellMinPrice.toString()];
};
