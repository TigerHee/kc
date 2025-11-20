/**
 * Owner: garuda@kupotech.com
 */
/**
 * 计算器计算结果函数
 * a 系数 multiplier
 * tickSize 币种精度的小数位数
 * 计算结果不包含手续费跟资金费率
 */
import Decimal from 'decimal.js';

import {
  abs,
  multiply,
  plus,
  minus,
  dividedBy,
  toDP,
  lessThanOrEqualTo,
  greaterThanOrEqualTo,
  CURRENCY_UNIT,
  greaterThan,
  lessThan,
  calcValue,
  formatSizeSide,
} from '../../builtinCommon';

import { BTN_SELL } from '../../config';

// 处理小精度显示为0的问题
export const getExactNum = (num, fixed = 2, mod = Decimal.ROUND_HALF_CEIL) => {
  let decimalValue = toDP(num)(fixed, mod).toFixed();
  let smallNum = 0.01;
  if (greaterThan(fixed)(1)) {
    smallNum = `0.${Array(fixed - 1)
      .fill(0)
      .join('')}1`;
  }
  if (greaterThan(num)(0) && lessThan(num)(smallNum)) {
    decimalValue = `< ${smallNum}`;
  }
  if (lessThan(num)(0) && greaterThan(num)(-smallNum)) {
    decimalValue = `> -${smallNum}`;
  }
  return decimalValue;
};

export const calcSize = (contract, data) => {
  const { isInverse, multiplier } = contract;
  const { openSize, tradingUnit } = data;
  let size = multiply(openSize)(multiplier);
  if (!isInverse && tradingUnit === CURRENCY_UNIT) {
    size = openSize;
  }
  return abs(size);
};
/**
 * 计算保证金
 * 正向 posInit = round(abs(a*openPrice*Qty/Lev), fixed)
 * 反向 posInit = round(abs(a*Qty/openPrice/Lev), tickSize)
 */
export const calcCostMargin = (contract, data, fixed = 8) => {
  const { isInverse } = contract;
  const { leverage, openPrice } = data;
  const size = calcSize(contract, data);
  let cost = multiply(size)(openPrice);
  if (isInverse) {
    cost = dividedBy(size)(openPrice);
  }
  const postInit = dividedBy(cost)(leverage);
  return toDP(postInit)(fixed);
};

/**
 * 计算收益
 * 正向 Pnl = round{ side*a*Qty*(closePrice-openPrice), fixed }
 * 反向 Pnl = round{ (side*a*Qty/closePrice-side*a*Qty/openPrice), tickSize }
 */
export const calcProfit = (contract, data, fixed = 8) => {
  const { isInverse } = contract;
  const { openPrice, closePrice, btnType } = data;
  const side = btnType === BTN_SELL ? -1 : 1;
  const size = calcSize(contract, data);
  const sideSize = multiply(side)(size);
  let pnl = minus(multiply(sideSize)(closePrice))(multiply(sideSize)(openPrice));
  if (isInverse) {
    pnl = minus(dividedBy(sideSize)(openPrice))(dividedBy(sideSize)(closePrice));
  }
  return toDP(pnl)(fixed);
};

/**
 * 计算收益率
 * roe = round(pnl / postInit, fixed) * 100
 */
export const calcProfitRate = (pnl, postInit, fixed = 4) => {
  const roe = toDP(dividedBy(pnl)(postInit))(fixed);
  return multiply(roe)(100);
};

/**
 * 计算平仓价格
 * 正向 round( Roe*openPrice/Lev/side+openPrice, tickSize)
 * 反向 round( a*side/(Roe*abs(1/openPrice/Lev)+side*a/openPrice), tickSize)
 */
export const calcClosePrice = (contract, data, fixed = 8) => {
  const { isInverse, multiplier } = contract;
  const { leverage, openPrice, btnType, profitRate } = data;
  const side = btnType === BTN_SELL ? -1 : 1;
  const roe = dividedBy(profitRate)(100);
  let oneCost = dividedBy(dividedBy(openPrice)(leverage))(side);
  let pnlValue = multiply(roe)(oneCost);
  let closePrice = plus(pnlValue)(openPrice);
  if (isInverse) {
    const sideSize = multiply(multiplier)(side);
    oneCost = dividedBy(dividedBy(1)(openPrice))(leverage);
    pnlValue = plus(multiply(roe)(oneCost))(dividedBy(sideSize)(openPrice));
    closePrice = dividedBy(sideSize)(pnlValue);
  }
  return toDP(closePrice)(fixed);
};

/**
 * 计算强平价格
 * 正向 round(openPrice*(1-side*(1/Lev)+side*MM%), tickSize)
 * 反向 round(openPrice/(1-side*MM%+side*(1/Lev)), tickSize)
 * 若强平价格≤{最小委托价格}，则强平价格 = 最小委托价格
 * 若强平价格≥{最大委托价格}，则强平价格 = 最大委托价格
 */
export const calcLiquidationPrice = (contract, data, fixed = 8) => {
  const { isInverse, maintainMargin, maxPrice, tickSize } = contract;
  const { btnType, openPrice, leverage } = data;
  const side = btnType === BTN_SELL ? -1 : 1;
  const sideLev = multiply(side)(dividedBy(1)(leverage));
  const sideMM = multiply(side)(maintainMargin);
  let liquidationPrice = multiply(openPrice)(plus(minus(1)(sideLev))(sideMM));
  if (isInverse) {
    liquidationPrice = dividedBy(openPrice)(plus(minus(1)(sideMM))(sideLev));
  }
  if (lessThanOrEqualTo(liquidationPrice)(tickSize)) {
    return tickSize;
  }
  if (greaterThanOrEqualTo(liquidationPrice)(maxPrice)) {
    return maxPrice;
  }
  return toDP(liquidationPrice)(fixed);
};

window.calcParam = {};
/**
 * 计算器强平价值
 * liquidValue = （开仓价值 - 可用保证金)）/（1-side*维持保证金率-side*taker 费率）
 * openQtySize 需要时单位张哦
 */
export const calcCalculatorLiquidValue = ({ data, symbolInfo, MMR }) => {
  const { isInverse, takerFeeRate } = symbolInfo;
  const { btnType, openPrice, openQtySize, availableMargin } = data;
  const openValue = calcValue({ symbolInfo, qty: openQtySize, price: openPrice });
  let side = btnType === BTN_SELL ? -1 : 1;
  // 反向合约
  if (isInverse) {
    side *= -1;
  }
  const p = minus(minus(1)(multiply(side)(MMR)))(multiply(side)(takerFeeRate));

  // TODO
  window.calcParam = {
    ...window.calcParam,
    MMR: MMR.toString(),
    takerFeeRate,
    a: minus(openValue)(availableMargin).toString(),
    p: p.toString(),
  };
  return dividedBy(minus(openValue)(availableMargin))(p).toString();
};

/**
 * 计算器强平价格
 */
export const calcCalculatorLiquidPrice = ({ liquidValue, params, symbolInfo, fixed }) => {
  const { isInverse, indexPriceTickSize, maxPrice } = symbolInfo;
  const { openQtySize, btnType } = params;
  // 仓位方向
  const isLong = btnType !== BTN_SELL;
  const posSize = formatSizeSide({
    side: isLong ? 'buy' : 'sell',
    size: openQtySize,
    symbolInfo,
    isBaseCurrency: true,
  });
  let ret;
  const round = isLong ? Decimal.ROUND_UP : Decimal.ROUND_DOWN;
  // 正向合约
  if (!isInverse) {
    ret = dividedBy(liquidValue)(posSize);
    // 反向合约
  } else {
    ret = dividedBy(posSize)(liquidValue);
  }
  // TODO
  window.calcParam = {
    ...window.calcParam,
    liquidationPrice: ret.toString(),
    liquidValue: liquidValue.toString(),
  };
  if (lessThanOrEqualTo(ret)(indexPriceTickSize)) {
    return isLong ? indexPriceTickSize : maxPrice;
  }
  if (greaterThanOrEqualTo(ret)(maxPrice)) {
    return maxPrice;
  }
  return toDP(ret)(fixed, round).toString();
};
