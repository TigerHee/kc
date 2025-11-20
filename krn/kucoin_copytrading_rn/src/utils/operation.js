/**
 * Owner: borden@kupotech.com
 * Desc: 封装Decimal的计算公式，并处理返回结果
 */
import Decimal from 'decimal.js';
import _ from 'lodash';

export function transformParam(a) {
  // 输入值为undefined或者null处理为0
  if (a == null || a === '') {
    a = new Decimal(0);
  }
  if (!Decimal.isDecimal(a)) {
    const isNaNB = isNaN(_.toNumber(a));
    a = new Decimal(isNaNB ? NaN : a);
  }

  return a;
}

export const plus = a => {
  a = transformParam(a);
  return b => {
    b = transformParam(b);
    return a.plus(b);
  };
};

export const minus = a => {
  a = transformParam(a);
  return b => {
    b = transformParam(b);
    return a.minus(b);
  };
};

export const multiply = a => {
  a = transformParam(a);
  return b => {
    b = transformParam(b);
    return a.times(b);
  };
};

export const min = (...rest) => {
  const params = rest.map(r => transformParam(r));
  return Decimal.min(...params);
};

export const max = (...rest) => {
  const params = rest.map(r => transformParam(r));
  return Decimal.max(...params);
};

export const equals = a => {
  a = transformParam(a);
  return b => {
    b = transformParam(b);
    return a.equals(b);
  };
};

export const greaterThan = a => {
  a = transformParam(a);
  return b => {
    b = transformParam(b);
    return a.greaterThan(b);
  };
};

export const greaterThanOrEqualTo = a => {
  a = transformParam(a);
  return b => {
    b = transformParam(b);
    return a.greaterThanOrEqualTo(b);
  };
};

export const lessThan = a => {
  a = transformParam(a);
  return b => {
    b = transformParam(b);
    return a.lessThan(b);
  };
};

export const lessThanOrEqualTo = a => {
  a = transformParam(a);
  return b => {
    b = transformParam(b);
    return a.lessThanOrEqualTo(b);
  };
};

export const comparedTo = a => {
  a = transformParam(a);
  return b => {
    b = transformParam(b);
    return a.comparedTo(b);
  };
};

export const dividedBy = a => {
  a = transformParam(a);
  return b => {
    b = transformParam(b);
    if (equals(b)(0)) {
      // 如果分母为0按0返回
      return new Decimal(0);
    }
    return a.dividedBy(b);
  };
};

export const percentage = a => {
  a = transformParam(a);
  return multiply(a)(100);
};

export const round = a => {
  a = transformParam(a);
  return a.round();
};

export const abs = a => {
  a = transformParam(a);
  return a.absoluteValue();
};

export const toFixed = a => {
  a = transformParam(a);
  return (b, modName = 'ROUND_HALF_UP') => {
    if (b == null) {
      return a.toFixed();
    }
    return a.toFixed(b, Decimal[modName]);
  };
};

export const toNonExponential = a => {
  const _a = transformParam(a);
  if (!_a.isFinite()) {
    return a;
  }
  const m = _a.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return _a.toFixed(Math.max(0, (m[1] || '').length - m[2]));
};

// 计算比例，百分化
export const percent = a => {
  a = transformParam(a);
  return (b, percentageMod = false) => {
    b = transformParam(b);
    let r = dividedBy(abs(a))(abs(b));
    if (percentageMod) {
      r = percentage(r);
    }
    return r;
  };
};

// 保证金余额
export const marginBalanceOperator = (
  availableBalance,
  orderMargin,
  maintMargin,
  withdrawHold,
) => {
  return plus(plus(plus(availableBalance)(orderMargin))(maintMargin))(
    withdrawHold,
  );
};

// 账户权益
export const availableBalanceOperator = (marginBalance, unrealisedPNL) => {
  return minus(marginBalance)(unrealisedPNL);
};

// 保证金使用率, 百分化
export const marginUsageRateOperator = (maintMargin, walletBalance) => {
  return percent(maintMargin)(walletBalance, true);
};

// 总仓位合并杠杆
export const mergedLeverageOperator = (currentCost, walletBalance) => {
  return dividedBy(abs(currentCost))(walletBalance);
};

// 订单价值
export const orderValueOperator = (size, price, multiplier) => {
  const roundPrice = toFixed(dividedBy(multiplier)(price))(10);
  return abs(toFixed(multiply(roundPrice)(size))(8));
};

// 市价最小成交价格
export const marketMinDealPriceOperator = (price, reduce) => {
  return minus(price)(multiply(price)(reduce));
};

// 开仓手续费
export const openFeeOperator = (
  addSize,
  minDealPrice,
  takerFeeRate,
  fixTakerFee,
) => {
  const roundPrice = toFixed(dividedBy(1)(minDealPrice))(10);
  const roundValue = abs(toFixed(multiply(roundPrice)(addSize))(8));
  return plus(multiply(roundValue)(takerFeeRate))(
    abs(multiply(addSize)(fixTakerFee)),
  );
};

// 平仓手续费
export const closeFeeOperator = (
  addSize,
  minDealPrice,
  takerFeeRate,
  fixTakerFee,
  leverage,
) => {
  const roundPrice = toFixed(dividedBy(1)(minDealPrice))(10);
  const roundValue = abs(toFixed(multiply(roundPrice)(addSize))(8));
  return plus(
    multiply(multiply(roundValue)(plus(dividedBy(1)(leverage))(1)))(
      takerFeeRate,
    ),
  )(abs(multiply(addSize)(fixTakerFee)));
};

// 成本
export const costOperator = (openMargin, openFee, closeFee) => {
  return plus(plus(openMargin)(openFee))(closeFee);
};

// 开仓保证金
export const openMarginOperator = (addSize, minDealPrice, leverage) => {
  const roundPrice = toFixed(dividedBy(1)(minDealPrice))(10);
  const roundValue = abs(toFixed(multiply(roundPrice)(addSize))(8));
  return dividedBy(roundValue)(leverage);
};

// 正向加仓条件
export const posIncreaseOddsOperator = (positionSize, orderSize) => {
  return (
    equals(positionSize)(0) ||
    greaterThan(abs(plus(orderSize)(positionSize)))(abs(orderSize))
  );
};

// 反向加仓
export const negIncreaseOddsOperator = (positionSize, orderSize) => {
  return (
    lessThan(abs(positionSize))(abs(orderSize)) &&
    lessThan(abs(plus(orderSize)(positionSize)))(abs(orderSize))
  );
};

// 减仓条件
export const decreaseOddsOperator = (positionSize, orderSize) => {
  return (
    greaterThanOrEqualTo(abs(positionSize))(abs(orderSize)) &&
    lessThanOrEqualTo(abs(plus(orderSize)(positionSize)))(abs(positionSize))
  );
};

// 最高买价
export const maxBuyPriceOperator = indexPrice => {
  return multiply(indexPrice)(1.05);
};

// 最低卖价
export const minSellPriceOperator = markPrice => {
  return multiply(markPrice)(0.95);
};

export const toDP = a => {
  a = transformParam(a);
  return (b, modName) => {
    if (b == null) {
      return a.toDP();
    }
    return a.toDP(b, Decimal[modName]);
  };
};

// -------------------- 止损价格反推止损比例公式 start--------------------
// 正向止损比例
export const forwardStopPercentOperator = ({
  stopPrice,
  posCost,
  posMargin,
  posMaint,
  currentQty,
  multiplier,
}) => {
  const positionNum = multiply(currentQty)(multiplier);
  const stopLossAmount = minus(multiply(stopPrice)(positionNum))(posCost);
  const realAmount = minus(posMargin)(posMaint);

  return toFixed(
    multiply(toFixed(dividedBy(stopLossAmount)(realAmount))())(100),
  )();
};
// 反向止损比例
export const stopPercentOperator = ({
  stopPrice,
  posCost,
  posMargin,
  posMaint,
  currentQty,
  multiplier,
}) => {
  const positionNum = multiply(currentQty)(multiplier);
  const stopLossAmount = minus(dividedBy(positionNum)(stopPrice))(posCost);
  const realAmount = minus(posMargin)(posMaint);
  return toFixed(
    multiply(toFixed(dividedBy(stopLossAmount)(realAmount))())(100),
  )();
};

// 止损提示条件
export const stopLossTipOperator = ({stopPercent, lev}) => {
  return toFixed(
    multiply(dividedBy(minus(1)(abs(dividedBy(stopPercent)(100))))(lev))(100),
  )();
};

// 杠杆倍数计算
export const stopLossLevOperator = ({posCost, posInit}) => {
  return toFixed(abs(dividedBy(posCost)(posInit)))();
};

// 数字转小数，比如 2 转成 0.01
export const toPow = v => {
  if (v == null) {
    return 0.01;
  }
  return Decimal(10).pow(transformParam(-v)).toNumber();
};

export const ln = a => {
  a = transformParam(a);
  return a.ln();
};

export const toNearest = a => {
  a = transformParam(a);
  return (b, modName) => {
    b = transformParam(b);
    return a.toNearest(b, Decimal[modName]);
  };
};
