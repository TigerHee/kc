/**
 * Owner: garuda@kupotech.com
 * 计算公式
 */
import {
  abs,
  multiply,
  plus,
  minus,
  dividedBy,
  toDP,
  //   max,
  //   min,
  //   lessThanOrEqualTo,
} from 'utils/operation';

/**
 * 订单价值
 * USDs：price * size * multiplier
 * 币本位：1/price * size * multiplier
 */
export const orderValue = ({ contract, size, price }, fixed = 12) => {
  const { isInverse, multiplier } = contract;
  const calcValue = !isInverse
    ? multiply(multiply(multiplier)(price))(size)
    : multiply(multiply(dividedBy(1)(price))(size))(multiplier);
  return toDP(calcValue)(fixed).toString();
};

/**
 * 未实现盈亏：标记价值 - 当前仓位价值
 * data: markPrice -- 标记价格 ｜ currentQty -- 仓位数量 ｜ posCost -- 仓位价值
 * avgEntryPrice -- 平均开仓价值，
 */
export const calcPosIsolatedUnPnl = ({ contract, markPrice, currentQty, posCost }, fixed = 12) => {
  const mpValue = orderValue({ contract, price: markPrice, size: currentQty });
  const calcValue = minus(mpValue)(posCost);
  return toDP(calcValue)(fixed).toString();
};

/**
 * 总保证金：仓位保证金 + 前端计算未实现盈亏
 */
export const calcPosIsolatedTotalMargin = ({ positionMargin, unPnl }, fixed = 12) => {
  const calcValue = plus(positionMargin)(unPnl);
  return toDP(calcValue)(fixed).toString();
};

/**
 * ROE:
 * 未实现盈亏 / 仓位起始保证金
 */

export const calcPosIsolatedROE = ({ unPnl, positionInitMargin }, fixed = 12) => {
  const calcValue = dividedBy(unPnl)(positionInitMargin);
  return toDP(calcValue)(fixed).toString();
};

/**
 * 真实杠杆
 * 当前标记价值/(仓位总保证金 - 破产费用）
 */
export const calcPosIsolatedRealLeverage = (
  { markValue, positionTotalMargin, bankruptFee },
  fixed = 12,
) => {
  const calcValue = dividedBy(abs(markValue))(minus(abs(positionTotalMargin))(bankruptFee));
  return toDP(calcValue)(fixed).toString();
};
