/**
 * Owner: garuda@kupotech.com
 * 计算公式
 */
import Decimal from 'decimal.js';
import {
  abs,
  multiply,
  plus,
  minus,
  dividedBy,
  toDP,
  greaterThanOrEqualTo,
  // max,
  lessThan,
  greaterThan,
  toFixed,
} from 'utils/operation';

import { APPEND_TABS } from './config';

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
 * 调整后的保证金 == 调整前总保证金 - 提取金额 or 调整前总保证金 + 追加金额
 * 总保证金 totalMargin
 * 操作保证金 margin 减少保证金为负数
 * 操作 type | append 追加 reducer 减少
 */
export const AdjustMargin = ({ totalMargin, margin, type }, fixed = 12) => {
  const operatorMargin = type === APPEND_TABS ? margin : -margin;
  const calcValue = plus(totalMargin)(operatorMargin);
  return toDP(calcValue)(fixed).toString();
};

/**
 * 调整后的杠杆 == 标记价值 / (调整后的总保证金 - 强平手续费posComm)
 * markValue 标记价值
 * totalMargin 总保证金
 */
export const AdjustLeverage = ({ markValue, totalMargin, posComm }, fixed = 12) => {
  const calcValue = dividedBy(abs(markValue))(minus(abs(totalMargin))(posComm));
  return toDP(calcValue)(fixed).toString();
};

/**
 * 调整前的强平价值：posCost - (仓位实际资金 - posMaint) | 仓位实际资金前端取 posMargin
 * 正向：
 * 提取保证金-> (调整前强平价值+提取金额) / (数量 * multiplier)
 * 追加保证金-> (调整前强平价值-追加金额) / (数量 * multiplier)
 * 反向：
 * 提取保证金->  (数量 * multiplier) / (调整前强平价值+提取金额)
 * 追加保证金->  (数量 * multiplier) / (调整前强平价值-追加金额)
 */
export const AdjustLiquidationPrice = (
  { contract, posCost, posMargin, posMaint, margin, size, type },
  fixed = 12,
) => {
  const { isInverse, tickSize, multiplier, maxPrice } = contract;
  const liquidationValue = minus(posCost)(minus(posMargin)(posMaint));
  const operatorMargin = type === APPEND_TABS ? -margin : margin;
  let calcValue;
  if (isInverse) {
    calcValue = dividedBy(multiply(size)(multiplier))(plus(liquidationValue)(operatorMargin));
  } else {
    calcValue = dividedBy(plus(liquidationValue)(operatorMargin))(multiply(size)(multiplier));
  }

  const isNegativeCalcValue = lessThan(calcValue)(0);
  // 如果 size 是负数，代表做空仓位，判断算出来的是否为负数，负数则直接取最大值，兜底兼容，算出来的值不能大于 maxPrice
  if (
    (lessThan(size)(0) && isNegativeCalcValue) ||
    (calcValue && greaterThan(calcValue)(maxPrice))
  ) {
    calcValue = maxPrice;
  }
  // 如果 size 是正数，代表做多仓位，判断算出来的是否为负数，负数则直接取 tickSize，兜底兼容，算出来的值不能小于 tickSize
  if (
    (greaterThan(size)(0) && isNegativeCalcValue) ||
    (calcValue && lessThan(calcValue)(tickSize))
  ) {
    calcValue = tickSize;
  }

  return toDP(calcValue)(fixed).toString();
};

/**
 * 调整后的开仓价格 符合下面的公式 开仓价格不变，否则开仓价格等于标记价格
 * 保证金posMargin -强平手续费posComm - 提取金额margin >= abs(未调整开仓价值posCost)/最大杠杆maxLeverage
 * 返回 true 或者 false
 */
export const AdjustOpenPositionPrice = ({ posMargin, posComm, margin, posCost, maxLeverage }) => {
  const currentMargin = minus(minus(posMargin)(posComm))(margin);
  const maxValue = dividedBy(abs(posCost))(maxLeverage);
  return greaterThanOrEqualTo(currentMargin)(maxValue);
};

/**
 * 最大可调整杠杆, 向下取整
 * abs(标记价值) / (总保证金 - 强平手续费 - 最大可提取金额)
 */
export const maxAdjustableLeverage = (
  { markValue, totalMargin, posComm, maxWithdrawMargin },
  fixed = 2,
) => {
  const calcValue = dividedBy(abs(markValue))(
    minus(minus(totalMargin)(posComm))(maxWithdrawMargin),
  );
  return toFixed(calcValue)(fixed, Decimal.ROUND_DOWN).toString();
};

/**
 * 最小可调整杠杆, 向上取整
 * abs(标记价值) / (总保证金 - 强平手续费 + 可用金额)
 */
export const minAdjustableLeverage = (
  { markValue, totalMargin, posComm, availableBalance },
  fixed = 2,
) => {
  const calcValue = dividedBy(abs(markValue))(plus(minus(totalMargin)(posComm))(availableBalance));
  return toFixed(calcValue)(fixed, Decimal.ROUND_UP).toString();
};

/**
 * 预计提取金额
 * 当前总保证金 - 强平手续费 - 标记价值/输入杠杆
 * 判断是追加还是减少 预计提取金额如果为正数，就是提取，如果为负数，就是追加
 */
export const expectWithdrawMargin = ({ totalMargin, markValue, posComm, leverage }, fixed = 12) => {
  const calcValue = minus(minus(totalMargin)(posComm))(dividedBy(abs(markValue))(leverage));
  return toDP(calcValue)(fixed).toString();
};
