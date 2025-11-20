import {isValidNumber} from 'utils/helper';
import {
  dividedBy,
  greaterThanOrEqualTo,
  lessThanOrEqualTo,
  minus,
  percentage,
  plus,
} from 'utils/operation';

// 定义策略枚举
export const STRATEGY_ENUM = {
  CLEAR_ALL: 'Clear All',
  CLEAR_TAKE_PROFIT: 'Clear Take Profit',
  CLEAR_STOP_LOSS: 'Clear Stop Loss',
  NO_ACTION: 'No Action',
};

/**
 * 根据给定的参数计算需要执行的策略
 *
 * @param {number} currentCopyMaxAmount - 跟单金额
 * @param {number} currentAsset - 资产
 * @param {number} takeProfitRatio - 止盈百分比
 * @param {number} stopLossRatio - 止亏比例
 * @return {string} 返回策略枚举值
 */
export const determineWithTpSlRuleStrategy = ({
  currentCopyMaxAmount,
  currentAsset,
  takeProfitRatio,
  stopLossRatio,
  newCopyMaxAmount,
}) => {
  //本次需求上线暂时增加log: 测试看日志
  // 条件 1: 跟单金额 <= 0，清空止盈止损
  if (lessThanOrEqualTo(newCopyMaxAmount)(0)) {
    return STRATEGY_ENUM.CLEAR_ALL;
  }

  const targetAmount = minus(newCopyMaxAmount)(currentCopyMaxAmount);
  // 计算 (跟单资产 - 跟单金额) / 跟单金额
  const value = percentage(
    dividedBy(minus(plus(currentAsset)(targetAmount))(newCopyMaxAmount))(
      newCopyMaxAmount,
    ),
  );
  // 条件 2: value >= 止盈百分比，清止盈
  if (
    isValidNumber(takeProfitRatio) &&
    greaterThanOrEqualTo(value)(takeProfitRatio)
  ) {
    return STRATEGY_ENUM.CLEAR_TAKE_PROFIT;
  }

  // 条件 3: Math.abs(value) >= 止亏比例，清止亏
  const absoluteValue = Math.abs(value);
  if (
    lessThanOrEqualTo(value)(0) &&
    isValidNumber(stopLossRatio) &&
    greaterThanOrEqualTo(absoluteValue)(stopLossRatio)
  ) {
    return STRATEGY_ENUM.CLEAR_STOP_LOSS;
  }

  // 条件 4: 都不符合，无需处理
  return STRATEGY_ENUM.NO_ACTION;
};
