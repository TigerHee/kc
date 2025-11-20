/**
 * Owner: clyne@kupotech.com
 */

import Decimal from 'decimal.js';

import { reduce } from 'lodash';

import { getDigit } from 'src/helper';
import {
  dividedBy,
  max,
  min,
  multiply,
  plus,
  abs,
  greaterThan,
  minus,
  ln,
  equals,
  toDP,
  lessThanOrEqualTo,
  greaterThanOrEqualTo,
  toNearest,
  lessThan,
} from 'src/utils/operation';

import { getFuturesCrossConfigForSymbol, getFuturesCrossBuffer } from '@/hooks/common/useSymbol';
import {
  getPositionCalcData,
  getMMR,
  getCrossOrderSizeMap,
  getCrossPosOrderMargin,
} from '@/hooks/futures/useCalcData';
import { getCrossTotalMargin } from '@/hooks/futures/useCrossTotalMargin';
import { getCurrenciesPrecision } from '@/hooks/futures/useGetCurrenciesPrecision';
import { getLeverage } from '@/hooks/futures/useLeverage';
import { getMarkPrice } from '@/hooks/futures/useMarket';
import {
  baseCurrencyToQty,
  qtyToBaseCurrency,
  transFuturesCrossCalcQty,
} from '@/hooks/futures/useUnit';
import { FUTURES } from '@/meta/const';
import { SELL, BUY, QUANTITY_UNIT } from '@/meta/futures';

import { formatCurrency } from '@/utils/futures/formatCurrency';

/**
 * 格式化size，带符号
 * size 为张的单位
 * 数量带正负，正向做多/反向做空为正，正向做空/反向做多为负
 * 反向做多为负是因为 multiplier 为 -1
 */
export const formatSizeSide = ({ side, size, symbolInfo }) => {
  const _side = side === BUY ? 1 : -1;
  const quantitySize = multiply(_side)(abs(size));
  return multiply(quantitySize)(symbolInfo?.multiplier).toString();
};

/**
 * 根据价格计算价值
 * 正向：合约乘数 * 开仓均价 * 仓位数量
 * 反向：合约乘数 * (1 / 开仓均价 * 仓位数量)
 */
export const calcValue = ({ symbolInfo, qty, price }) => {
  const { isInverse, multiplier } = symbolInfo || {};
  const ret = !isInverse
    ? multiply(multiply(multiplier)(price))(qty)
    : multiply(multiply(dividedBy(1)(price))(qty))(multiplier);
  return ret.toString();
};

/**
 * 新价值
 * USDs: price * size
 * 币本位：size / price
 */
export const newValue = ({ symbolInfo, size, price }) => {
  const cValue = !symbolInfo?.isInverse ? multiply(price)(size) : dividedBy(size)(price);
  return cValue.toString();
};

/**
 * 仓位维持保证金率
 * MMR = min(MMR1, mmrLimit)
 * mmrLimit：作为mmr的上限，默认0.3
 * MMR1=(1+n/m)*(1/(2*maxLev))
 * maxLev：该合约最大可支持的杠杆倍数，取逐仓风险限额设置的最低挡位的杠杆
 * n：用户在该合约全仓持有的数量，n = posOrderQty
 * m：常数，定义为平台在该合约的持有数量的阈值。
 * posOrderQty单位为baseCurrency
 */
export const calcMMR = ({ maxLev, m, mmrLimit = 0.3, posOrderQty: n }) => {
  const part1 = plus(1)(dividedBy(n)(m));
  const part2 = dividedBy(1)(multiply(2)(maxLev));
  const MMR1 = multiply(part1)(part2);
  return min(MMR1, mmrLimit).toString();
};

/**
 * 全仓保证金率 / 下单的预计全仓保证金率
 * 币种AMR = 币种totalMargin / ∑abs(对应结算币种的仓位标记价值)
 * tips下单的预计AMR可以传一个orderValue，就是预计AMR
 */
export const calcAMR = ({ totalMargin, allPosValueMap = {}, currency }) => {
  const allPosValue = allPosValueMap[currency];
  return dividedBy(totalMargin)(allPosValue).toString();
};

/**
 * 初始保证金率
 * IMR = max(1/lev, MMR*f)
 * leverage：用户选择的杠杆
 * f：调整系数，默认1.3。配置值须＞1
 */
export const calcIMR = ({ leverage, f = 1.3, MMR }) => {
  return max(dividedBy(1)(leverage), multiply(MMR)(f)).toString();
};

/**
 * 全仓-订单保证金
 * 正向合约 = abs(订单数量) * 委托价格 *（IMR+taker费率）
 * 反向合约 = abs(订单数量) / 委托价格*（IMR+taker费率）
 */
export const calcCrossOrderMargin = ({ symbolInfo, price, size, side, IMR, takerFeeRate }) => {
  const formatSize = formatSizeSide({ symbolInfo, side, size });
  const oV = newValue({ symbolInfo, size: abs(formatSize), price });
  const IMRTaker = plus(IMR)(takerFeeRate);
  return multiply(abs(oV))(IMRTaker).toString();
};

/**
 * 全仓 - 合约持仓订单总占用
 * 此处为1个合约自身的订单和占用对冲后计算的总占用，主要应用于最大可开公式中的F，每个合约的计算完成后，加和即为F
 * max(|A|, |B|)
 * A = 持仓同向订单保证金 + 持仓保证金
 * B = 反向非零占用订单保证金
 * 正向合约
 * 订单保证金 = abs(订单数量) * 委托价格 *（IMR+taker费率）
 * 持仓保证金 = 标记价格 *abs( 仓位数量) * IMR
 * 反向合约
 * 订单保证金 = abs(订单数量) / 委托价格*（IMR+taker费率）
 * 持仓保证金 = abs(仓位数量) / 标记价格 * IMR
 */
export const calcCrossPositionOrderMargin = ({
  symbolInfo,
  currentQty,
  positionMargin,
  orderMarginMap,
}) => {
  const [forwardSide, reverseSide] = greaterThan(currentQty)(0) ? [BUY, SELL] : [SELL, BUY];

  const getMargin = (side) => orderMarginMap?.[`${symbolInfo?.symbol}-${side}`];

  const forwardMargin = plus(getMargin(forwardSide))(positionMargin);

  return max(abs(forwardMargin), abs(getMargin(reverseSide))).toString();
};

/**
 * 全仓-最大可开数量
 * 正向合约 = max(0, k*ln((C - F)*x/(k*p)+1) - 该合约同向挂单及持仓数量 + 反向持仓数量)
 * 反向合约 = max(0, k*ln((C - F)*x*p/k+1) - 该合约同向挂单及持仓数量 + 反向持仓数量)
 * k：当前合约的配置
 * x：用户选择的当前合约的杠杆
 * C = 用户全仓总保证金（最小值取0）
 * F = 其他全仓合约仓位和订单占用的保证金之和，按合约区分后，计算每个合约的持仓和订单对冲总占用（最小值取0）
 * 可用余额 = 用户全仓总保证金 - 全仓所有仓位挂单占用
 * C - F (取可用余额 + 当前订单持仓挂单占用) 这个需要恒大于等于0，如果小于0，则为0
 * p：单数量占用价值
 * 正向合约 = 预计成交价 * (1+taker费率*x)
 * 反向合约 = 预计成交价/(1+taker费率*x)
 * 该币种：指该合约
 * 反向持仓数量：与当前订单相反的持仓数量
 * 计算结果：正向合约为 baseCurrency | 反向合约为 张
 * 传入 tradingUnit 之后，会根据 tradingUnit 返回，默认 tradingUnit 为张
 */
export const calcCrossMaxOrder = ({
  symbolInfo = {},
  totalMargin,
  leverage: x,
  price,
  takerFeeRate,
  isLong,
  tradingUnit = QUANTITY_UNIT,
}) => {
  const { isInverse, symbol, maxOrderQty, multiplier, lotSize, settleCurrency } = symbolInfo;
  const { posOrderMarginCurrency, posOrderMarginSymbol } = getCrossPosOrderMargin() || {};
  const posOrderMargin = posOrderMarginCurrency?.[settleCurrency];
  // 全仓总保证金为0 不计算
  if (!totalMargin) return 0;

  const { k } = getFuturesCrossConfigForSymbol({ symbol }) || {};
  const baseTaker = plus(1)(multiply(takerFeeRate)(x));

  const { isCross, currentQty } = getPositionCalcData(symbol) || {};
  const orderSizeMap = getCrossOrderSizeMap() || {};

  let sameOrderQty = 0;
  let reversePositionQty = 0;
  const side = isLong ? BUY : SELL;

  const posOrderMarginCurrent = posOrderMarginSymbol?.[symbol];

  // 全仓
  if (isCross) {
    // 同向持仓
    if ((isLong && greaterThan(currentQty)(0)) || (!isLong && lessThan(currentQty)(0))) {
      sameOrderQty = plus(sameOrderQty)(currentQty);
    } else {
      reversePositionQty = plus(reversePositionQty)(currentQty);
    }
  }

  sameOrderQty = formatSizeSide({
    side,
    size: plus(abs(sameOrderQty))(abs(orderSizeMap[`${symbol}-${side}`] || 0)),
    symbolInfo,
  });

  reversePositionQty = formatSizeSide({ side, size: reversePositionQty, symbolInfo });

  const p = isInverse ? dividedBy(price)(baseTaker) : multiply(price)(baseTaker);

  const availableBalance = minus(totalMargin)(posOrderMargin);
  const availableMargin = max(plus(availableBalance)(posOrderMarginCurrent), 0);

  const levMargin = multiply(availableMargin)(x);

  const orderSize = isInverse
    ? dividedBy(multiply(levMargin)(p))(k)
    : dividedBy(levMargin)(multiply(k)(p));

  let maxSize = plus(minus(multiply(k)(ln(plus(orderSize)(1))))(abs(sameOrderQty)))(
    abs(reversePositionQty),
  );

  // console.log(
  //   'calcMaxOrder --->',
  //   symbol,
  //   side,
  //   orderSizeMap[`${symbol}-${side}`],
  //   orderSizeMap,
  //   totalMargin?.toString(),
  //   posOrderMarginCurrent?.toString(),
  //   availableMargin?.toString(),
  //   posOrderMargin?.toString(),
  //   k,
  //   p?.toString(),
  //   orderSize.toString(),
  //   levMargin.toString(),
  //   sameOrderQty?.toString(),
  //   reversePositionQty?.toString(),
  // );
  // TODO: 全仓 remove
  window.inspectMaxOrder = () => {
    return {
      price,
      symbol,
      side,
      orderSizeMap,
      totalMargin: totalMargin?.toString(),
      posOrderMarginCurrent: posOrderMarginCurrent?.toString(),
      availableMargin: availableMargin?.toString(),
      posOrderMargin: posOrderMargin?.toString(),
      k,
      p: p?.toString(),
      orderSize: orderSize.toString(),
      levMargin: levMargin.toString(),
      sameOrderQty: sameOrderQty?.toString(),
      reversePositionQty: reversePositionQty?.toString(),
    };
  };
  const isQuantity = isInverse || tradingUnit === QUANTITY_UNIT;

  maxSize = transFuturesCrossCalcQty({
    amount: maxSize,
    symbolInfo,
    tradingUnit,
  });
  // TIPS: 这里后端返回的是张数，所以当满足条件时 需要从 qty 转到 baseCurrency
  const maxOrder = qtyToBaseCurrency({
    amount: maxOrderQty,
    baseIncrement: multiplier,
    isQuantity,
  });

  const buffer = getFuturesCrossBuffer({ symbol });
  let calcMaxValue = maxSize;

  const fixed = isQuantity ? lotSize || 0.01 : multiplier;
  const maxSizeRound = toNearest(calcMaxValue)(fixed, Decimal.ROUND_DOWN);
  const maxSizeBuffer = toNearest(multiply(buffer)(calcMaxValue))(fixed, Decimal.ROUND_DOWN);

  // console.log('maxSize --->', maxSize, maxSizeRound?.toString(), maxSizeBuffer?.toString());
  // 如果乘了buffer 跟原计算一致，则判断是否大于最小可开，大于的话，需要减掉最小可开
  if (equals(maxSizeRound)(maxSizeBuffer) && greaterThan(maxSizeBuffer)(fixed)) {
    calcMaxValue = minus(calcMaxValue)(fixed);
  } else {
    calcMaxValue = maxSizeBuffer;
  }

  // 判断是否超过最大下单值
  if (greaterThan(calcMaxValue)(maxOrder)) {
    calcMaxValue = maxOrder;
  }

  return max(0, calcMaxValue).toString();
};

/**
 * 全仓-预计AMR
 * 预计AMR = (totalMargin+该合约预计仓位盈亏)/(∑abs(其他合约全仓仓位标记价值)+abs(新仓位价值))
 * 该合约预计仓位盈亏
 * 正向合约 = (该笔订单预计成交价-标记价格)*仓位数量
 * 反向合约 = 仓位数量*(1/该笔订单预计成交价-1/标记价格)
 */
export const calcExpectAMR = ({ symbolInfo, totalMargin, posUnPnl, newMarkValue }) => {
  const { symbol, settleCurrency } = symbolInfo || {};
  const expectMargin = plus(totalMargin)(posUnPnl);
  if (!symbol || lessThanOrEqualTo(expectMargin)(0)) return '--';
  // 取仓位的计算值
  const positionCalcData = getPositionCalcData();
  const allCrossMarkValue = reduce(
    positionCalcData,
    (acc, cur, key) => {
      if (
        key !== symbol &&
        cur?.isCross &&
        formatCurrency(cur?.settleCurrency) === formatCurrency(settleCurrency)
      ) {
        acc = plus(acc)(abs(cur?.markValue));
      }
      return acc;
    },
    0,
  );
  console.log('expectMargin --->', expectMargin?.toString());
  return dividedBy(expectMargin)(plus(allCrossMarkValue)(abs(newMarkValue))).toString();
};

/**
 * 全仓-预计强平
 * 预计#强平价值# =（新仓位价值 - abs(新仓位价值*预计AMR) ）/（1-side*维持保证金率-side*taker 费率）
 * 新仓位价值
 * 正向合约 = (当前订单数量+仓位数量)*该笔订单预计成交价格
 * 反向合约 = (当前订单数量+仓位数量)/该笔订单预计成交价格
 * 预计#强平价格#
 * 正向合约 = 预计强平价值/新数量
 * 反向合约 = 新数量/预计强平价值
 * 新数量：预计该笔订单成交后的数量。若新数量=0(即平仓单)，预计强平价显示为-如仓位是10，订单是2，新数量=12；订单是-2，新数量=8
 * 正向合约 做多side=1 做空side=-1
 * 反向合约 做多side=-1 做空side=1
 * 若取不到标记价格，限价单取委托价格，市价单取对手盘买一卖一价
 * 预计强平价格显示为-
 * - 若totalMargin+该合约预计仓位盈亏≤0
 * - 若下单数量＞最大可开数量
 * - 新数量=0
 * 预计强平价格为不爆仓时，做多显示为indexPriceTickSize，做空显示为价格最大值
 */
export const calcCrossExpectLiquidation = ({
  symbolInfo = {},
  price,
  size: inputSize,
  isBuy,
  takerFeeRate,
  maxOrderQty,
  tradingUnit = QUANTITY_UNIT,
}) => {
  const {
    symbol,
    isInverse,
    settleCurrency,
    maxPrice,
    indexPriceTickSize,
    multiplier,
  } = symbolInfo;
  // 取标记价格
  const markPrice = getMarkPrice(symbol);
  // 取totalMargin
  const totalMargin = getCrossTotalMargin(settleCurrency);
  // 取仓位的计算值
  const positionCalcData = getPositionCalcData(symbol);

  const isQuantity = tradingUnit === QUANTITY_UNIT || isInverse;

  const size = baseCurrencyToQty({
    amount: inputSize,
    baseIncrement: multiplier,
    isQuantity,
  });

  // size 大于最大可开，不进行计算
  if (greaterThan(size)(maxOrderQty)) return '--';

  const sideSize = formatSizeSide({ side: isBuy ? BUY : SELL, size, symbolInfo });
  const { currentQty } = positionCalcData || {};
  const positionSide = greaterThan(currentQty)(0) ? BUY : SELL;
  const positionQty = formatSizeSide({ side: positionSide, size: currentQty, symbolInfo });

  const MMR = getMMR(symbol);
  const newSize = plus(sideSize)(positionQty);

  // 新数量值等于0 不进行计算
  if (equals(newSize)(0)) return '--';

  const sizeBuy = isInverse ? lessThan(newSize)(0) : greaterThan(newSize)(0);
  const side = greaterThan(newSize)(0) ? 1 : -1;
  const newMarkValue = newValue({ symbolInfo, price, size: newSize });
  // 预计未实现盈亏
  const posUnPnl = isInverse
    ? multiply(positionQty)(minus(dividedBy(1)(price))(dividedBy(1)(markPrice)))
    : multiply(minus(price)(markPrice))(positionQty);

  const AMR = calcExpectAMR({ symbolInfo, totalMargin, posUnPnl, newMarkValue });

  // 如果 AMR 返回 '-' 不走后续流程直接返回
  if (AMR === '--') return '--';
  const takerMR = minus(minus(1)(multiply(side)(MMR)))(multiply(side)(takerFeeRate));
  const liquidationValue = dividedBy(minus(newMarkValue)(multiply(AMR)(abs(newMarkValue))))(
    takerMR,
  );

  let liquidationPrice = (isInverse
    ? dividedBy(newSize)(liquidationValue)
    : dividedBy(liquidationValue)(newSize)
  ).toString();

  console.log(
    'liquidationValue --->',
    price,
    newSize?.toString(),
    side,
    MMR,
    newMarkValue?.toString(),
    posUnPnl?.toString(),
    AMR?.toString(),
    totalMargin?.toString(),
    liquidationValue?.toString(),
    takerMR?.toString(),
    liquidationPrice?.toString(),
    maxPrice,
    indexPriceTickSize,
  );
  const isNegativeCalcValue = lessThan(liquidationPrice)(0);
  // 如果是做空，判断算出来的是否为负数，负数则直接取最大值，兜底兼容，算出来的值不能大于 maxPrice
  if ((!sizeBuy && isNegativeCalcValue) || greaterThan(liquidationPrice)(maxPrice)) {
    liquidationPrice = maxPrice;
  }
  // 如果做多，判断算出来的是否为负数，负数则直接取 indexPriceTickSize，兜底兼容，算出来的值不能小于 indexPriceTickSize
  if ((sizeBuy && isNegativeCalcValue) || lessThan(liquidationPrice)(indexPriceTickSize)) {
    liquidationPrice = indexPriceTickSize;
  }

  return liquidationPrice;
};

/**
 * 全仓-模拟计算最大可开
 * 正向合约 = max(0, k*ln(C*x/(k*p)+1)
 * 反向合约 = max(0, k*ln(C*x*p/k+1)
 * C=用户输入的可用余额，x为选择的杠杆，k为平台配置，p为输入的价格
 * 正向合约计算数量为 baseCurrency 反向合约为张
 */
export const calcCrossSandMaxOrder = ({ symbolInfo = {}, totalMargin: C, leverage: x, price }) => {
  const { isInverse, symbol } = symbolInfo;
  const { k } = getFuturesCrossConfigForSymbol({ symbol }) || {};
  const leverageAmount = multiply(C)(x);
  const qty = isInverse
    ? dividedBy(multiply(leverageAmount)(price))(k)
    : dividedBy(leverageAmount)(multiply(price)(k));
  return max(0, multiply(k)(ln(plus(qty)(1)))).toString();
};


const DOWN = Decimal.ROUND_DOWN;
const UP = Decimal.ROUND_UP;

const isLongPos = ({ currentQty }) => {
  return greaterThan(currentQty)(0);
};

const getMP = (position, markPrice) => {
  return markPrice || position.markPrice || '0';
};
/**
 * 全仓百分比反推止盈止损价格
 * 正向合约：止盈止损价格 = 开仓均价*百分比*side/杠杆+开仓均价
 * 反向合约：止盈止损价格=开仓均价/(1+百分比*side/杠杆)
 * 百分比根据止盈止损分别带±,止盈为+，止损为-
 * side：正向合约 做多=1，做空=-1；反向合约 做多=-1，做空=1
 */
export const calcCrossSLAndPLPrice = ({
  position,
  symbolInfo,
  stopType,
  stopPriceType = 'TP',
  percent,
}) => {
  const { avgEntryPrice, leverage: _lev, symbol, marginMode } = position;
  const lev = getLeverage({
    symbol,
    marginMode,
    needDefault: false,
  });
  const leverage = lev || _lev;
  const { isInverse, tickSize, indexPriceTickSize } = symbolInfo;
  // 标记价格根指数价格的精度需要使用indexPriceTickSize， 最近成交使用tickSize
  const fixed = getDigit(stopPriceType === 'TP' ? tickSize : indexPriceTickSize);
  const _pct = abs(percent);
  // 仓位方向
  const isLong = isLongPos(position);
  const pct = stopType !== 'profit' ? multiply(_pct)(-1) : _pct;
  let side;
  let ret;
  // 正向合约
  if (!isInverse) {
    side = isLong ? 1 : -1;
    ret = plus(dividedBy(multiply(multiply(avgEntryPrice)(pct))(side))(leverage))(avgEntryPrice);
    // 反向合约
  } else {
    side = isLong ? -1 : 1;
    ret = dividedBy(avgEntryPrice)(plus(1)(dividedBy(multiply(pct)(side))(leverage)));
  }
  return toDP(ret)(fixed, isLong ? UP : DOWN);
};

/**
 * 全仓止盈止损盈亏
 * 正向合约：止盈止损数量 * (止盈止损价格 - 开仓均价)
 * 反向合约：止盈止损数量 * (1/止盈止损价格 - 1/开仓均价)
 * 数量带正负，同仓位方向，正向做多/反向做空为正，正向做空/反向做多为负
 * tips: 数量传递进来都是张
 * 数量单位为baseCurrency
 */
export const calcCrossStopPNL = ({ position, symbolInfo, stopQty: sQty, stopPrice }) => {
  const { avgEntryPrice, settleCurrency } = position;
  const { isInverse } = symbolInfo;
  const { shortPrecision: coinFixed } = getCurrenciesPrecision(settleCurrency);
  // 仓位方向
  const isLong = isLongPos(position);
  const stopQty = formatSizeSide({
    side: isLong ? 'buy' : 'sell',
    size: sQty,
    symbolInfo,
    isBaseCurrency: true,
  });
  let ret;
  // 正向合约
  if (!isInverse) {
    ret = multiply(stopQty)(minus(stopPrice)(avgEntryPrice));
    // 反向合约
  } else {
    ret = multiply(stopQty)(minus(dividedBy(1)(stopPrice))(dividedBy(1)(avgEntryPrice)));
  }
  return toDP(ret)(coinFixed, DOWN);
};

/**
 * 全仓平仓预计盈亏
 * 正向合约：平仓数量 * (平仓价格 - 开仓均价)
 * 反向合约：平仓数量 * (1/平仓价格 - 1/开仓均价)
 * 数量带正负，同仓位方向，正向做多/反向做空为正，正向做空/反向做多为负
 * tips: 数量传递进来都是张
 * 数量单位为baseCurrency
 */
export const calcCloseCrossPosPnl = ({ position, closePrice, closeQty: cQty, symbolInfo }) => {
  const { avgEntryPrice, settleCurrency } = position;
  const { isInverse } = symbolInfo;
  const { shortPrecision: coinFixed } = getCurrenciesPrecision(settleCurrency);
  // 仓位方向
  const isLong = isLongPos(position);
  const closeQty = formatSizeSide({
    side: isLong ? 'buy' : 'sell',
    size: cQty,
    symbolInfo,
    isBaseCurrency: true,
  });
  let ret;
  // 正向合约
  if (!isInverse) {
    ret = multiply(closeQty)(minus(closePrice)(avgEntryPrice));
    // 反向合约
  } else {
    ret = multiply(closeQty)(minus(dividedBy(1)(closePrice))(dividedBy(1)(avgEntryPrice)));
  }
  return toDP(ret)(coinFixed, DOWN).toString();
};

/**
 * 全仓占用占用保证金
 * 正向合约 = 标记价格 *abs(仓位数量) * IMR
 * 反向合约 = abs(仓位数量) / 标记价格 * IMR
 * 仓位数量 = 仓位张数*合约系数*方向；正向做多/反向做空为正，正向做空/反向做多为负
 * tips: 数量传递进来都是张
 * 数量单位为baseCurrency
 */
export const calcCrossPosMargin = ({ position, symbolInfo, IMR, markPrice }) => {
  const { markPrice: posMP, currentQty } = position;
  const { isInverse } = symbolInfo;
  const isLong = isLongPos(position);
  const qty = abs(
    formatSizeSide({
      side: isLong ? 'buy' : 'sell',
      size: abs(currentQty),
      symbolInfo,
      isBaseCurrency: true,
    }),
  );
  // 取不到实时的时候拿仓位上面的
  const MP = markPrice || posMP || '0';
  let ret;
  if (!isInverse) {
    ret = multiply(multiply(MP)(qty))(IMR);
  } else {
    ret = multiply(dividedBy(qty)(MP))(IMR);
  }
  return ret.toString();
};

/**
 * 全仓UnPNL
 * UnPNL = 标记价值 - 开仓价值
 * tips: 全仓与逐仓共用
 */
export const calcUnPNL = ({ position, symbolInfo, markPrice }) => {
  const { currentQty, avgEntryPrice } = position;
  const MP = getMP(position, markPrice);
  const markValue = calcValue({ symbolInfo, qty: currentQty, price: MP });
  const openValue = calcValue({ symbolInfo, qty: currentQty, price: avgEntryPrice });
  return minus(markValue)(openValue).toString();
};

/**
 * 全仓强平价值
 * liquidValue = （标记价值 - abs(标记价值）*AMR) ）/（1-side*维持保证金率-side*taker 费率）
 * 正向合约 做多side=1 做空side=-1
 * 反向合约 做多side=-1 做空side=1
 */
export const calcCrossLiquidValue = ({
  position,
  symbolInfo,
  AMR,
  MMR,
  markPrice,
  takerFeeRate,
}) => {
  const { currentQty } = position;
  const { isInverse } = symbolInfo;
  // 仓位方向
  const isLong = isLongPos(position);
  const MP = getMP(position, markPrice);
  const markValue = calcValue({ symbolInfo, price: MP, qty: currentQty });
  const inverseSide = isLong ? -1 : 1;
  const perpetualsSide = isLong ? 1 : -1;
  const side = isInverse ? inverseSide : perpetualsSide;
  const part1 = minus(markValue)(multiply(abs(markValue))(AMR));
  const part2 = minus(minus(1)(multiply(side)(MMR)))(multiply(side)(takerFeeRate));
  return dividedBy(part1)(part2).toString();
};

/**
 * 全仓仓位强平价格
 * 根据价格精度，做多向上取值，做空向下取值
 * 正向合约 = 强平价值 / 仓位数量
 * 反向合约 = 仓位数量 / 强平价值
 * 仓位数量带正负，正向做多/反向做空为正，正向做空/反向做多为负
 * 数量单位为baseCurrency
 */
export const calcCrossLiquidPrice = ({
  position,
  symbolInfo,
  AMR,
  MMR,
  markPrice,
  takerFeeRate,
}) => {
  const { isInverse, indexPriceTickSize, maxPrice } = symbolInfo;
  const fixed = getDigit(indexPriceTickSize);
  const { currentQty } = position;
  // 仓位方向
  const isLong = isLongPos(position);
  // baseCurrency的仓位数量
  const posSize = formatSizeSide({
    side: isLong ? 'buy' : 'sell',
    size: currentQty,
    symbolInfo,
    isBaseCurrency: true,
  });
  const liquidValue = calcCrossLiquidValue({
    position,
    symbolInfo,
    AMR,
    MMR,
    takerFeeRate,
    markPrice,
  });
  const round = isLong ? UP : DOWN;
  let ret;
  // 正向合约
  if (!isInverse) {
    ret = dividedBy(liquidValue)(posSize);
    // 反向合约
  } else {
    ret = dividedBy(posSize)(liquidValue);
  }
  if (lessThanOrEqualTo(ret)(indexPriceTickSize)) {
    return isLong ? indexPriceTickSize : maxPrice;
  }
  if (greaterThanOrEqualTo(ret)(maxPrice)) {
    return maxPrice;
  }
  return toDP(ret)(fixed, round).toString();
};

/**
 * 持仓挂单对冲数量 posOrderQty
 * posOrderQty= max(A,B)
 * A = abs(Σ持仓同向订单数量+持仓数量)
 * B = abs(Σ持仓反向订单数量+持仓数量)
 * 数量带正负，正向做多/反向做空为正，正向做空/反向做多为负
 * 主要用于全仓计算占用其他字段时化简使用
 *
 * 用于计算预计开仓手续费公式中的max(Σ仓位同向订单，Σ仓位反向订单)部分
 * 返回的数量为baseCurrency
 */
export const calcPosOrderQty = ({ position: posData, symbolInfo, orderMap = {} }) => {
  const { symbol: posSymbol } = posData;
  let position = posData;
  // 兼容处理，判断兼容仓位是否有值，无值，处理成空仓位
  if (!posSymbol) {
    position = { symbol: symbolInfo.symbol, currentQty: 0 };
  }
  const isPosLong = isLongPos(position);
  const { currentQty, symbol } = position;
  const forwardSide = !isPosLong ? 'sell' : 'buy';
  const reverseSide = !isPosLong ? 'buy' : 'sell';
  const forwardKey = `${symbol}-${forwardSide}`;
  const reverseKey = `${symbol}-${reverseSide}`;
  // 订单方向, 这里的单位是张
  let forwardOrdersSize = orderMap[forwardKey] || '0';
  let reverseOrdersSize = orderMap[reverseKey] || '0';

  // 格式化
  forwardOrdersSize = formatSizeSide({
    side: forwardSide,
    size: forwardOrdersSize,
    symbolInfo,
    isBaseCurrency: true,
  });
  reverseOrdersSize = formatSizeSide({
    side: reverseSide,
    size: reverseOrdersSize,
    symbolInfo,
    isBaseCurrency: true,
  });
  const posQty = formatSizeSide({
    side: isPosLong ? BUY : SELL,
    size: currentQty,
    symbolInfo,
    isBaseCurrency: true,
  });
  // posOrderQty方向问题
  const A = abs(plus(forwardOrdersSize)(posQty));
  const B = abs(plus(reverseOrdersSize)(posQty));
  return max(A, B).toString();
};

/**
 * 持仓订单对冲维持保证金 posOrderMM
 * 主要用于风险率计算
 * 正向合约 = posOrderQty*标记价格*MMR
 * 反向合约 = posOrderQty/标记价格*MMR
 * posOrderQty单位为baseCurrency
 */
export const calcCrossPosOrderMM = ({ symbolInfo, position, posOrderQty, MMR, markPrice }) => {
  const { isInverse } = symbolInfo;
  const MP = getMP(position, markPrice);
  // 正向合约
  if (!isInverse) {
    return multiply(multiply(posOrderQty)(MP))(MMR).toString();
  }
  // 反向合约
  return multiply(dividedBy(posOrderQty)(MP))(MMR).toString();
};

/**
 * 预计平仓手续费 closeFee
 * 正向合约 = posOrderQty*标记价格*taker费率
 * 反向合约 = posOrderQty/标记价格*taker费率
 * posOrderQty单位为baseCurrency
 */
export const calcCrossCloseFee = ({
  symbolInfo,
  position,
  markPrice,
  posOrderQty,
  takerFeeRate,
}) => {
  const { isInverse } = symbolInfo;
  const MP = getMP(position, markPrice);
  // 正向合约
  if (!isInverse) {
    return multiply(multiply(posOrderQty)(MP))(takerFeeRate).toString();
  }
  // 反向合约
  return multiply(dividedBy(posOrderQty)(MP))(takerFeeRate).toString();
};

/**
 * 预计开仓手续费 openFee
 * 正向合约 = orderQty*标记价格*taker费率
 * 反向合约 = orderQty/标记价格*taker费率
 * orderQty = max(Σ仓位同向订单，Σ仓位反向订单)
 * 数量单位为baseCurrency
 *
 */
export const calcCrossOpenFee = ({ position, symbolInfo, takerFeeRate, markPrice, orderMap }) => {
  const { isInverse } = symbolInfo;
  const MP = getMP(position, markPrice);
  // 开仓手续费剔除仓位
  const orderQty = calcPosOrderQty({
    position: { ...position, currentQty: 0 },
    symbolInfo,
    orderMap,
  });
  // 正向合约
  if (!isInverse) {
    return multiply(multiply(orderQty)(MP))(takerFeeRate).toString();
  }
  // 反向合约
  return multiply(dividedBy(orderQty)(MP))(takerFeeRate).toString();
};

/**
 * 逐仓风险率
 * riskRatio = 逐仓仓位MM/逐仓仓位总保证金*100%
 */
export const calcIsolatedRiskRate = ({ isolatedMM, isolatedTotalMargin }) => {
  return dividedBy(isolatedMM)(isolatedTotalMargin).toString();
};

/**
 * 全仓风险率
 * riskRatio = (posOrderMM+closeFee)/(totalMargin-openFee)*100%
 */
export const calcCrossRiskRate = ({ posOrderMM, closeFee, totalMargin, openFee }) => {
  return dividedBy(plus(posOrderMM)(closeFee))(minus(totalMargin)(openFee)).toString();
};

/**
 * 暂时用不上了，先留着
 * 初始保证金
 * 仓位初始保证金 = abs（开仓价值 * IMR)
 */
// export const calcCrossInitialMargin = ({ symbolInfo, position, IMR }) => {
//   const { currentQty, avgEntryPrice } = position;
//   const openValue = calcValue({ symbolInfo, qty: currentQty, price: avgEntryPrice });
//   return abs(multiply(openValue)(IMR)).toString();
// };

/**
 * 不能前端计算，公式暂留
 * 仓位adl
 * ald = 杠杆 * (标记价值 - 开仓价值) / (开仓价值 / 杠杆)
 */

// export const calcADL = ({ position, symbolInfo, markPrice, leverage }) => {
//   const { avgEntryPrice, currentQty } = position;
//   const markValue = calcValue({ symbolInfo, qty: currentQty, price: markPrice });
//   const openValue = calcValue({ symbolInfo, qty: currentQty, price: avgEntryPrice });
//   // 杠杆 * (标记价值 - 开仓价值)
//   const part1 = multiply(leverage)(minus(markValue)(openValue));
//   // (开仓价值 / 杠杆)
//   const part2 = dividedBy(openValue)(leverage);
//   return dividedBy(part1)(part2).toString();
// };

/**
 * 总保证金：仓位保证金 + 前端计算未实现盈亏
 */
export const calcPosIsolatedTotalMargin = ({ positionMargin, unPnl }, fixed = 12) => {
  const result = plus(positionMargin)(unPnl);
  return toDP(result)(fixed).toString();
};

/**
 * ROE:
 * 未实现盈亏 / 仓位起始保证金
 */

export const calcPosROE = ({ unPnl, margin }, fixed = 12) => {
  const result = dividedBy(unPnl)(margin);
  return toDP(result)(fixed).toString();
};

/**
 * 真实杠杆
 * 当前标记价值/(仓位总保证金 - 破产费用）
 */
export const calcPosIsolatedRealLeverage = (
  { markValue, positionTotalMargin, bankruptFee },
  fixed = 12,
) => {
  const result = dividedBy(abs(markValue))(minus(abs(positionTotalMargin))(bankruptFee));
  return toDP(result)(fixed).toString();
};
