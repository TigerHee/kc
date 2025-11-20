/**
 * Owner: garuda@kupotech.com
 */
import Decimal from 'decimal.js';

import {
  abs,
  multiply,
  plus,
  minus,
  dividedBy,
  toDP,
  greaterThan,
  lessThan,
  toNearest,
} from '../../builtinCommon';

/**
 * @param {*} stopPercent 止盈止损比例 止盈为正 止损为负
 * @param {*} openPrice 开仓价
 * @param {*} lev 杠杆
 * @param {*} side 做多/做空
 * @param {*} fixed 小数位数
 * @param {*} a multiplier
 * @param {*} TP -- 止盈价格
 * @param {*} SL -- 止损价格
 * @param {*} MM% -- 维持保证金率
 */

/**
 * 止盈
 * 正向 round(stopPercent*openPrice/Lev*side+openPrice,ticksize)
 * 反向 round(a*side/(stopPercent*abs(1/openPrice/Lev)+side*a/openPrice),ticksize)
 */
export const calcProfitPrice = (contract, data, fixed = 8) => {
  const { isInverse, multiplier } = contract;
  const { stopPercent, openPrice, lev, side } = data;
  let calcValue;
  if (!isInverse) {
    calcValue = plus(multiply(dividedBy(multiply(stopPercent)(openPrice))(lev))(side))(openPrice);
  } else {
    const absLev = abs(dividedBy(dividedBy(1)(openPrice))(lev));
    calcValue = dividedBy(multiply(multiplier)(side))(
      plus(multiply(stopPercent)(absLev))(dividedBy(multiply(side)(multiplier))(openPrice)),
    );
  }
  return toDP(calcValue)(fixed).toString();
};

/**
 * 止盈百分比
 * round((TP-openPrice)/side*Lev/openPrice,2)
 * round((a*side/TP-side*a/openPrice)/abs(1/openPrice/Lev),2)
 */
export const calcProfitRate = (contract, data, fixed = 2) => {
  const { isInverse, multiplier } = contract;
  const { formPrice, openPrice, lev, side } = data;
  let calcValue;
  if (!isInverse) {
    const minusValue = minus(formPrice)(openPrice);
    calcValue = dividedBy(multiply(dividedBy(minusValue)(side))(lev))(openPrice);
  } else {
    const absLev = abs(dividedBy(dividedBy(1)(openPrice))(lev));
    const minusValue = minus(dividedBy(multiply(multiplier)(side))(formPrice))(
      dividedBy(multiply(side)(multiplier))(openPrice),
    );
    calcValue = dividedBy(minusValue)(absLev);
  }
  return toDP(abs(calcValue))(fixed);
};

/**
 * 止损
 * 正向 round(openPrice+side*(openPrice/Lev-openPrice*MM%)*stopPercent,ticksize)
 * 反向 round(1/(1/openPrice-side*(1/openPrice/Lev-1/openPrice*MM%)*stopPercent),ticksize)
 */
export const calcLossPrice = (contract, data, fixed = 8) => {
  const { isInverse, maintainMargin } = contract;
  const { stopPercent, openPrice, lev, side } = data;
  let calcValue;
  if (!isInverse) {
    const sidePercent = multiply(side)(stopPercent);
    const minusValue = minus(dividedBy(openPrice)(lev))(multiply(openPrice)(maintainMargin));
    calcValue = plus(openPrice)(multiply(sidePercent)(minusValue));
  } else {
    const sidePercent = multiply(side)(stopPercent);
    const minusValue = minus(dividedBy(dividedBy(1)(openPrice))(lev))(
      multiply(dividedBy(1)(openPrice))(maintainMargin),
    );
    calcValue = dividedBy(1)(minus(dividedBy(1)(openPrice))(multiply(sidePercent)(minusValue)));
  }
  return toDP(calcValue)(fixed).toString();
};

/**
 * 止损百分比
 * round((SL-openPrice)/side/(openPrice/Lev-openPrice*MM%),2)
 * round((1/openPrice-1/SL)/side/(1/openPrice/Lev-1/openPrice*MM%),2)
 */
export const calcLossRate = (contract, data, fixed = 2) => {
  const { isInverse, maintainMargin } = contract;
  const { formPrice, openPrice, lev, side } = data;
  let calcValue;

  if (!isInverse) {
    const minusValue = minus(formPrice)(openPrice);
    const minusMargin = minus(dividedBy(openPrice)(lev))(multiply(openPrice)(maintainMargin));
    calcValue = dividedBy(dividedBy(minusValue)(side))(minusMargin);
  } else {
    const minusValue = minus(dividedBy(dividedBy(1)(openPrice))(lev))(
      multiply(dividedBy(1)(openPrice))(maintainMargin),
    );
    calcValue = dividedBy(dividedBy(minus(dividedBy(1)(openPrice))(dividedBy(1)(formPrice)))(side))(
      minusValue,
    );
  }
  return toDP(abs(calcValue))(fixed);
};

/**
 * 预期强平价格
 * 正向 openPrice-side*(openPrice/Lev-openPrice*MM%)
 * 反向 round(openPrice/(1-side*MM%+side*(1/Lev)),ticksize)
 */
export const expectLiquidationPrice = (contract, data, fixed = 8) => {
  const { isInverse, maintainMargin } = contract;
  const { openPrice, lev, side } = data;
  let calcValue;
  if (!isInverse) {
    calcValue = minus(openPrice)(
      multiply(side)(minus(dividedBy(openPrice)(lev))(multiply(openPrice)(maintainMargin))),
    );
  } else {
    calcValue = dividedBy(openPrice)(
      plus(minus(1)(multiply(side)(maintainMargin)))(multiply(side)(dividedBy(1)(lev))),
    );
  }
  return toDP(calcValue)(fixed);
};

/**
 * 正向合约：
 * 做多：
 * 止盈计算≥{最大价格}，置为最大价格
 * 止损计算≤{价格精度}，最为价格精度
 * 做空：
 * 止盈计算≤{价格精度}，置为价格精度
 * 止损计算≥{最大价格}，置为最大价格
 * 反向合约：
 * 做多：
 * 止盈：百分比/杠杆=1时（除数为0），或止盈计算为负值，置为最大价格
 * 止损计算≤{价格精度}，置为价格精度
 * 做空：
 * 止盈计算≤{价格精度}，置为价格精度
 * 止损计算≥{最大价格}，置为最大价格
 */
export const makePnlLimitPrice = (contract, data) => {
  const { maxPrice } = contract;
  const { isLong, isProfit, value, precision } = data;
  if (!value) return value;
  const isExceedMax = greaterThan(value)(maxPrice);
  const isLessPrecision = lessThan(value)(precision);
  if (isLong) {
    if (isProfit && (isExceedMax || isLessPrecision)) {
      return maxPrice;
    }
    if (!isProfit && (isExceedMax || isLessPrecision)) {
      return precision;
    }
  } else {
    if (isProfit && (isExceedMax || isLessPrecision)) {
      return precision;
    }
    if (!isProfit && (isExceedMax || isLessPrecision)) {
      return maxPrice;
    }
  }
  return toNearest(value)(precision || 1, Decimal.ROUND_DOWN)
    .toFixed()
    .toString();
};
