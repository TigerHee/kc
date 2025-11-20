/**
 * Owner: garuda@kupotech.com
 */
// 封装Decimal的计算公式，并处理返回结果
import Decimal from 'decimal.js';

import {
  QUANTITY_UNIT,
  CURRENCY_UNIT,
  multiply,
  greaterThan,
  toNearest,
  dividedBy,
  abs,
  plus,
  lessThan,
  tradeLongShort,
  trackClick,
  SENSORS_MARGIN_TYPE,
  TRADE_ORDER_STOP,
  tradeConfirm,
  TRADE_CONFIRM,
  SWITCH_QTY,
  TRADE_ORDER_TYPE,
  BONUS_MODE_SWITCH,
  TRANSFER,
  OPEN_FUTURES,
  FUTURES_PWD,
} from './builtinCommon';
import { BUY, STOP } from './config';

export const returnStyleProps = (props, params) => {
  if (!props) return '';
  return props.theme.colors[params];
};

// 显示输入框的 placeholder
export const getPlaceholder = (n) => {
  if (!n) return '0';
  return Decimal(n).isInt() ? '0' : `${n}`.replace(/[1-9]/, '0');
};

/**
 * 根据指定的参数计算单位值
 * @param {Object} options - 参数对象
 * @param {number} options.size - 大小
 * @param {number} options.multiplier - 合约乘数
 *  @param {string} options.tradingUnit - 交易单位
 *  @returns {number} 计算后的单位值
 * */
export const makeUnitValue = ({ size, multiplier = 1, tradingUnit }) => {
  if (!size) return 0;
  const qtyMultiplier = tradingUnit === QUANTITY_UNIT ? 1 : Math.abs(multiplier);
  const unitValue = multiply(size)(qtyMultiplier);
  return unitValue;
};

/**
 * 根据指定的参数计算持仓数量
 * @param {Object} options - 参数对象
 *  @param {number} positionSize - 仓位数量
 *  @param {number} options.ratio - 比率
 *  @param {string} options.tradingUnit - 交易单位
 *  @param {number} options.multiplier - 合约乘数
 *  @returns {number} 计算后的持仓数量
 * */

export const makeSizeForRatio = ({ positionSize, ratio = 1, tradingUnit, multiplier = 1 }) => {
  const qtyMultiplier = tradingUnit === QUANTITY_UNIT ? 1 : Math.abs(multiplier);
  const roundedPositionSize = toNearest(multiply(multiply(positionSize)(ratio))(qtyMultiplier))(
    qtyMultiplier,
    Decimal.ROUND_DOWN,
  );
  return roundedPositionSize;
};

/**
 * 利用余额计算可用的交易数量
 * @param {Object} params 参数对象
 * @param {number} params.ratio 杠杆比例
 * @param {number} params.expectPrice 预期成交价格
 * @param {boolean} params.isInverse 是否为反向合约
 * @param {number} params.multiplier 合约乘数
 * @param {number} params.fixTakerFee 固定手续费
 * @param {number} params.lev 杠杆倍数
 * @param {number} params.takerFeeRate 手续费率
 * @param {number} params.lotSize 最小交易单位
 * @param {number} params.availableBalance 可用余额
 * @param {number} params.maxOrderQty 最大订单数量
 * @param {string} params.tradingUnit 交易单位（CURRENCY_UNIT 或 QUANTITY_UNIT）
 * @param {boolean} params.needTrans 是否需要切换交易单位 默认 true
 * @returns {number} 可用的交易数量
 * */
export const makeAvailableToSize = ({
  ratio,
  expectPrice,
  isInverse,
  multiplier,
  fixTakerFee,
  lev,
  takerFeeRate,
  lotSize,
  availableBalance,
  maxOrderQty,
  tradingUnit,
  positionSize,
  isLong,
  needTrans = true,
}) => {
  if (!multiplier) return 0;
  // 计算一张的价值
  const singleValue = abs(
    isInverse ? dividedBy(multiplier)(expectPrice) : multiply(multiplier)(expectPrice),
  );
  // 计算单张开平仓固定手续费
  const singleFixFee = multiply(fixTakerFee || 0)(2);
  // 计算单张开平仓浮动手续费
  const singleRateFee = multiply(multiply(plus(2)(dividedBy(1)(lev)))(singleValue))(takerFeeRate);

  // 单张成本 singleValue / lev + singleFixFee + singleRateFee
  const singleCost = plus(plus(dividedBy(singleValue)(lev))(singleFixFee))(singleRateFee);

  // 可用余额百分比
  const selectedAvailable = multiply(availableBalance)(ratio);

  // 数量为selectedAvailable / singleCost 张
  let expectedSize = toNearest(dividedBy(selectedAvailable)(singleCost))(
    lotSize,
    Decimal.ROUND_DOWN,
  );

  expectedSize = expectedSize.isFinite() ? expectedSize.toNumber() : 0;

  const isPositionSell = lessThan(positionSize)(0);
  // 这里加上仓位的持仓数量
  if (isLong && isPositionSell) {
    expectedSize = plus(expectedSize)(abs(positionSize));
  } else if (!isLong && !isPositionSell) {
    expectedSize = plus(expectedSize)(abs(positionSize));
  }

  if (greaterThan(expectedSize)(maxOrderQty)) {
    expectedSize = maxOrderQty;
  }

  if (tradingUnit === CURRENCY_UNIT && !isInverse && needTrans) {
    expectedSize = multiply(expectedSize)(multiplier).toNumber();
  }

  return expectedSize;
};

// ============= 埋点 ============== //
// 下单按钮埋点
export const tradeButtonSensors = (values) => {
  trackClick([tradeLongShort, values?.side === 'buy' ? '1' : '2'], {
    symbol: values?.symbol,
    leverage: values?.lev,
    orderType: values?.orderType || values?.type,
    reduceOnly: values.closeOnly ? 'yes' : 'no',
    hidden: values.hidden ? 'yes' : 'no',
    TIF: values.advancedType,
    stopOrder: values.stopPriceType ? 'yes' : 'no',
    marginType: SENSORS_MARGIN_TYPE[values?.marginMode] || 'isolated',
  });
};

// 下单二次确认点击确认
export const tradeConfirmSensors = (values) => {
  trackClick([tradeConfirm, values?.side === 'buy' ? '1' : '2'], {
    symbol: values?.symbol,
    leverage: values?.lev,
    orderType: values?.orderType || values?.type,
    reduceOnly: values.closeOnly ? 'yes' : 'no',
    hidden: values.hidden ? 'yes' : 'no',
    TIF: values.advancedType,
    stopOrder: values.stopPriceType ? 'yes' : 'no',
    marginType: SENSORS_MARGIN_TYPE[values?.marginMode] || 'isolated',
  });
};

// 下单终止埋点
export const tradeOrderStopSensors = ({ type }) => {
  trackClick([TRADE_ORDER_STOP, '2'], {
    reportType: type,
  });
};

// 下单二次弹框
export const tradeOrderConfirmSensors = ({ type }) => {
  trackClick([TRADE_CONFIRM, '1'], {
    reportType: type,
  });
};

// 下单切换交易单位
export const tradeOrderQtySensors = ({ unit }) => {
  trackClick([SWITCH_QTY, '1'], {
    qytUnit: unit,
  });
};

// 下单切换订单类型
export const tradeOrderTypeSensors = ({ type }) => {
  trackClick([TRADE_ORDER_TYPE, '1'], {
    reportType: type,
  });
};

// 体验金开关操作
export const tradeTrialFundSwitchSensors = ({ status }) => {
  trackClick([BONUS_MODE_SWITCH, status ? '1' : '2']);
};

// 划转操作
export const tradeTransferSensors = (locationId = '1') => {
  trackClick([TRANSFER, locationId]);
};

// 下单面板除下单点击外的事件
const BTN_OTHER = {
  openFutures: OPEN_FUTURES,
  setPwd: FUTURES_PWD,
};
export const tradeButtonOtherSensors = (type) => {
  if (BTN_OTHER[type]) {
    trackClick([BTN_OTHER[type], '1']);
  }
};

// 转换下单类型数据
export const transformValues = (values) => {
  const postValues = { ...values };
  postValues.timeInForce = 'GTC';
  postValues.visibleSize = postValues.postVisibleSize;
  postValues.size = postValues.postSize;

  postValues.hidden = true; // 默认值设置成 true

  // 不存在 hidden 值，设置成 false
  if (postValues.visibleSize == null || !String(postValues.visibleSize)) {
    delete postValues.visibleSize;
    delete postValues.postVisibleSize;
    postValues.hidden = false;
  }

  if (postValues.hidden && greaterThan(postValues.visibleSize)(0)) {
    postValues.iceberg = true;
  }

  // 不是条价单，并且同时没有填写止盈止损价格，删除止盈止损 type 值
  if (postValues._type !== STOP && !postValues.stopProfitPrice && !postValues.stopLossPrice) {
    delete postValues.stopPriceType;
  }

  if (postValues.advancedType) {
    // 非 postOnly 直接赋值 FOK | IOC
    if (postValues.advancedType !== 'postOnly') {
      postValues.timeInForce = postValues.advancedType;
    } else {
      postValues.postOnly = true;
    }
  }

  if (postValues.stopProfitPrice) {
    if (postValues.side === BUY) {
      postValues.triggerStopUpPrice = postValues.stopProfitPrice;
    } else {
      postValues.triggerStopDownPrice = postValues.stopProfitPrice;
    }

    delete postValues.stopProfitPrice;
  }

  if (postValues.stopLossPrice) {
    if (postValues.side === BUY) {
      postValues.triggerStopDownPrice = postValues.stopLossPrice;
    } else {
      postValues.triggerStopUpPrice = postValues.stopLossPrice;
    }

    delete postValues.stopLossPrice;
  }

  return postValues;
};
