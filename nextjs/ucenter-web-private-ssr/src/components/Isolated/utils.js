/**
 * Owner: willen@kupotech.com
 */
/*
 * @Author: Chrise
 * @Date: 2021-05-08 15:38:40
 * @Description: 逐仓的工具函数
 */
import {
  add,
  Decimal,
  formatNumberByStep,
  multiply as multiplyAndFixed,
  normalizeNumber,
  sub,
} from 'helper';
import { each, isNil } from 'lodash-es';

export const multiply = (a, b) => {
  return new Decimal(a).mul(b);
};
const divide = (a, b) => {
  return new Decimal(a).div(b);
};

// 币种金额通过标记价格转BTC
export const currencyAmount2BtcAmount = (amount, price, currency) => {
  if (currency === 'BTC') return amount;
  return multiply(amount, price).toFixed();
};
// BTC金额转币种金额
export const btcAmount2CurrencyAmount = (amount, price) => {
  return divide(amount, price).toFixed();
};
// 负债率 = base币种负债金额 + quote币种负债金额）/ （base币种总资产金额 + quote币种总资产金额）
export const getLiabilities = (totalBalance, totalLiability) => {
  let result;
  try {
    if (+totalBalance) {
      result = divide(totalLiability, totalBalance).toFixed();
      // 小于0.01%的，都算成0.00001
      if (+result && result < 0.0001) {
        result = 0.00001;
      } else {
        result = normalizeNumber(result, 4);
      }
    } else if (+totalLiability) {
      result = null; // 穿仓了
    } else {
      result = 0;
    }
  } catch (e) {
    result = null;
  }
  return result;
};

// 强平价 = （强平负债率*quote币种资产数量-quote币种负债数量）/（base币种负债数量-强平负债率*base币种资产数量）
export const getLiquidationPrice = (base, quote, flDebtRatio, pricePrecision) => {
  let result;
  try {
    const {
      liability: baseLiability,
      totalBalance: baseTotalBalance,
      marginCoefficient: baseMarginCoefficient = 1,
    } = base;
    const {
      liability: quoteLiability,
      totalBalance: quoteTotalBalance,
      marginCoefficient: quoteMarginCoefficient = 1,
    } = quote;
    const denominator = sub(
      baseLiability,
      multiply(flDebtRatio, multiply(baseTotalBalance, baseMarginCoefficient)),
    );
    if (+denominator.toFixed()) {
      result = normalizeNumber(
        divide(
          sub(
            multiply(multiply(flDebtRatio, quoteTotalBalance), quoteMarginCoefficient),
            quoteLiability,
          ),
          denominator,
        ),
        pricePrecision,
      );
      // result = result < 0 ? 0 : result;
    } else {
      result = null;
    }
  } catch (e) {
    result = null;
  }
  return result;
};
// 净资产现值金额
export const getNetAsset = (totalBalance, totalLiability) => {
  let result;
  try {
    result = sub(totalBalance, totalLiability).toFixed();
  } catch (e) {
    result = 0;
  }
  return result;
};
// 可用 = 总资产 - 冻结
export const getAvailableBalance = (total, hold, precision) => {
  let result;
  try {
    result = normalizeNumber(sub(total, hold), precision);
    if (+result < 0) result = 0;
  } catch (e) {
    result = 0;
  }
  return result;
};
// 盈亏 = 净资产现值金额 - 累计本金金额（单位：quote）
export const getEarning = (netAsset, quote, accumulatedPrincipal) => {
  if (isNil(accumulatedPrincipal)) return null;
  let result;
  try {
    const { precision } = quote;
    result = normalizeNumber(sub(netAsset, accumulatedPrincipal), precision);
  } catch (e) {
    result = null;
  }
  return result;
};
// 收益率 = 盈亏 / 累计本金金额
export const getEarningRate = (earning, accumulatedPrincipal) => {
  if (isNil(accumulatedPrincipal) || +accumulatedPrincipal < 0) return null;
  if (!+accumulatedPrincipal) return 0;
  return normalizeNumber(divide(earning, accumulatedPrincipal), 4);
};
// 折合总资产
export const getTotalAssets = (base, quote) => {
  let result;
  try {
    const { totalBalance: baseTotalBalance, price: basePrice } = base;
    const { totalBalance: quoteTotalBalance, price: quotePrice } = quote;
    const baseTotalAssets = multiplyAndFixed(baseTotalBalance, basePrice);
    const quoteTotalAssets = multiplyAndFixed(quoteTotalBalance, quotePrice);
    result = add(baseTotalAssets, quoteTotalAssets);
  } catch (e) {
    result = 0;
  }
  return result;
};
// 实际杠杆倍数=用户当前总资产/净资产
export const getRealLeaverage = (totalBalance, netAsset) => {
  let result;
  try {
    result = normalizeNumber(divide(totalBalance, netAsset), 1);
  } catch (e) {
    result = 0;
  }
  return result;
};
// 计算币种可借入数量(（杠杆倍数 - 1）* 账户净资产金额 - 账户负债总金额 ）/ 币种标记价格
// quoteIsSelf: 传入数据的结算单位是否是否币种本身，不是的话，传入的数据须以BTC为结算单位
// 公式计算之后，须再与剩余最大可借(最大可借 - 已借数量)比较，大于的话取剩余最大可借
// 否则与最小可借比较，小于的话取0.
// 结果需要根据最小可借单位来格式化数据
export const getMaxBorrowSize = (params) => {
  let result;
  try {
    const { coin, netAsset, userLeverage, quoteIsSelf, totalLiability } = params;
    const { liability, targetPrice, borrowMaxAmount, borrowMinAmount, currencyLoanMinUnit } = coin;

    const _leverage = sub(userLeverage, 1);
    if (!quoteIsSelf) {
      if (!targetPrice) {
        result = 0;
      } else {
        result = divide(sub(multiply(_leverage, netAsset), totalLiability), targetPrice);
      }
    } else {
      // 因为账户净资产金额和账户负债总金额传入的都是coin为单位的，所以计算不用转成BTC
      result = sub(multiply(_leverage, netAsset), totalLiability);
    }
    if (result) {
      // result = sub(result, liability).toFixed();
      const maxBorrowSize = sub(borrowMaxAmount, liability).toFixed();
      if (+result > +maxBorrowSize) {
        result = maxBorrowSize;
      }
      if (+result < +borrowMinAmount) {
        result = 0;
      }
      if (result) {
        result = formatNumberByStep(result, currencyLoanMinUnit);
      }
    }
  } catch (e) {
    result = 0;
  }
  return result;
};
// 滑动条单节点数值计算（1+节点下标*(最大杠杆倍数-1)/4）
export const getLeveragePoint = (maxLeverage, index, precision = 1) => {
  return normalizeNumber(add(1, divide(multiply(index, sub(maxLeverage, 1)), 4)), precision);
};
// 获取需要监听标记价格推送的交易对(字符串)
export const getTargetPriceSymbolsStr = (arr) => {
  if (!Array.isArray(arr)) return '';
  let result = '';
  each(arr, (v) => {
    if (v !== 'BTC') {
      const symbol = `${v}-BTC`;
      if (result) {
        result += `,${symbol}`;
      } else {
        result = symbol;
      }
    }
  });
  return result;
};
