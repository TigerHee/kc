/* eslint-disable prefer-const */
/**
 * Owner: mike@kupotech.com
 */
import { useSelector, shallowEqual } from 'dva';
import Decimal from 'decimal.js';

/**
 * @description: 处理合并base quote账户余额 现货 合约共用
 * @param {Object} symbolInfo 现货 合约 精度信息
 * @param {Number} lastTradedPrice 最新成交价格 使用多币种需要计算， 不用不传
 * @param {Boolean} useBaseCurrency 是否使用多币种
 * @return {*}
 */
const useBalance = (symbolInfo, lastTradedPrice, useBaseCurrency) => {
  const isFuture = symbolInfo.isInverse !== undefined;
  let {
    cbase: base,
    cquota: quote,
    quotePrecision,
    basePrecision,
    quoteMinSize,
    baseMinSize,
  } = symbolInfo;

  if (isFuture) {
    base = symbolInfo.base;
    quote = symbolInfo.quote;
    quotePrecision = symbolInfo.precision;
    basePrecision = symbolInfo.precision;
  }

  const isLogin = useSelector((state) => state.user.isLogin);
  const position = useSelector(
    (state) => state.user_assets.tradeMap,
    shallowEqual,
  );
  if (!isLogin) {
    return {
      baseAmount: 0,
      quoteAmount: 0,
      totalAmount: 0,
    };
  }

  let baseAmount = position[base]?.availableBalance || 0;
  let quoteAmount = position[quote]?.availableBalance || 0;

  // 标准精度,只显示大于等于MinSize的数量
  baseAmount = Decimal(baseAmount).toFixed(basePrecision, Decimal.ROUND_DOWN);
  quoteAmount = Decimal(quoteAmount).toFixed(
    quotePrecision,
    Decimal.ROUND_DOWN,
  );
  // 现货需要处理minSize
  if (!isFuture) {
    baseAmount = Decimal(baseAmount).greaterThanOrEqualTo(baseMinSize)
      ? baseAmount
      : 0;
    quoteAmount = Decimal(quoteAmount).greaterThanOrEqualTo(quoteMinSize)
      ? quoteAmount
      : 0;
  }
  // 现货用
  const getTotalAmount = (_lastTradedPrice) => {
    const baseToQuoteAmount = Decimal(baseAmount)
      .times(_lastTradedPrice || 0)
      .toFixed(quotePrecision, Decimal.ROUND_DOWN);
    const totalAmount = Decimal(baseToQuoteAmount)
      .add(quoteAmount)
      .toFixed(quotePrecision, Decimal.ROUND_DOWN);
    return totalAmount;
  };

  return {
    baseAmount: Number(baseAmount),
    quoteAmount: Number(quoteAmount),
    totalAmount: useBaseCurrency
      ? Number(getTotalAmount(lastTradedPrice))
      : Number(quoteAmount),
    getTotalAmount,
  };
};
export default useBalance;
