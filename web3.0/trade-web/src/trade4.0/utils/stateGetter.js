/*
 * @owner: borden@kupotech.com
 */
import { find } from 'lodash';
import { formatNumber } from '@/utils/format';
import { getStore } from 'src/utils/createApp';
import { dividedBy } from 'src/utils/operation';
import { add, multiply } from 'src/helper';
import {
  getNetAsset,
  getMaxBorrowSize,
  getRealLeaverage,
} from 'src/components/Isolated/utils';

/**
 * @returns 从store里直接拿取状态
 */
export const getStateFromStore = (fn) => fn(getStore().getState());
/**
 * @returns 杠杆的交易对标记价格
 */
export const getMarginMarkPrice = () => {
  const state = getStore().getState();
  const symbolsMap = state.symbols.symbolsMap;
  const currentSymbol = state.trade.currentSymbol;
  const targetPriceMap = state.isolated.targetPriceMap;
  const [base, quote] = currentSymbol.split('-');
  const baseTargetPrice = targetPriceMap?.[`${base}-BTC`];
  const quoteTargetPrice = targetPriceMap?.[`${quote}-BTC`];
  const { pricePrecision = 8 } = symbolsMap[currentSymbol] || {};
  if (baseTargetPrice && quoteTargetPrice) {
    const ret = dividedBy(baseTargetPrice)(quoteTargetPrice).toString();
    return formatNumber(ret, {
      dropZ: false,
      pointed: false,
      fixed: pricePrecision,
    });
  }
  return 0;
};
/**
 * @returns 币种数量通过标记价格转BTC数量
 */
export const currencyAmount2BtcAmount = ({ currency, amount, price }) => {
  const state = getStore().getState();
  const { targetPriceMap } = state.isolated;
  const targetPrice =
    currency === 'BTC' ? 1 : price || targetPriceMap[`${currency}-BTC`] || 0;
  return multiply(amount, targetPrice).toFixed();
};
/**
 * @returns 逐仓仓位计算多空方向
 */
export const getIsolatedPositionSide = ({ baseAsset, quoteAsset }) => {
  const { currency: base, liability: baseLiability } = baseAsset || {};
  const { currency: quote, liability: quoteLiability } = quoteAsset || {};
  const baseLiabilityToBtc = currencyAmount2BtcAmount({
    currency: base,
    amount: baseLiability,
  });
  const quoteLiabilityToBtc = currencyAmount2BtcAmount({
    currency: quote,
    amount: quoteLiability,
  });

  if (baseLiabilityToBtc < quoteLiabilityToBtc) {
    return 'long';
  } else if (baseLiabilityToBtc > quoteLiabilityToBtc) {
    return 'short';
  }
  return undefined;
};
/**
 * @returns 从store中获取币种信息
 */
export const getCoinInfoFromStore = (coin) => {
  const state = getStore().getState();
  return state?.categories?.[coin] || {};
};
/**
 * @returns 从store中获取杠杆币种配置
 */
export const getMarginCurrencyConfig = ({ tag, currency }) => {
  const state = getStore().getState();
  const { isolatedSymbolsMap } = state.symbols;
  const { crossCurrenciesMap, loanCurrenciesMap } = state.marginMeta;
  const { borrowMinAmount = 0, currencyLoanMinUnit = 0, marginBorrowEnabled } =
    loanCurrenciesMap[currency] || {};
  const { buyMaxAmount = 0, borrowMaxAmount = 0, borrowCoefficient = 1 } =
    crossCurrenciesMap[currency] || {};

  const commonConfig = { borrowMinAmount, currencyLoanMinUnit };

  const pair = tag?.split('-');
  // 逐仓
  if (pair?.includes(currency)) {
    const {
      baseBorrowEnable,
      baseMaxBuyAmount,
      quoteBorrowEnable,
      quoteMaxBuyAmount,
      baseMaxBorrowAmount,
      quoteMaxBorrowAmount,
      baseBorrowCoefficient = 1,
      quoteBorrowCoefficient = 1,
    } = isolatedSymbolsMap[tag] || {};
    //  base币种
    if (currency === pair[0]) {
      return {
        buyMaxAmount: baseMaxBuyAmount,
        isDebitEnabled: baseBorrowEnable,
        borrowMaxAmount: baseMaxBorrowAmount,
        borrowCoefficient: baseBorrowCoefficient,
        ...commonConfig,
      };
    } else {
      return {
        buyMaxAmount: quoteMaxBuyAmount,
        isDebitEnabled: quoteBorrowEnable,
        borrowMaxAmount: quoteMaxBorrowAmount,
        borrowCoefficient: quoteBorrowCoefficient,
        ...commonConfig,
      };
    }
  }
  return {
    buyMaxAmount,
    borrowMaxAmount,
    borrowCoefficient,
    isDebitEnabled: marginBorrowEnabled,
    ...commonConfig,
  };
};
/**
 * @returns 从store中获取杠杆仓位配置
 */
export const getMarginPositionConfig = (tag) => {
  const state = getStore().getState();
  const { isolatedSymbolsMap } = state.symbols;
  const { configs } = state.marginMeta;
  if (tag) return isolatedSymbolsMap[tag];
  return configs;
};
/**
 * @returns 计算杠杆最大可借
 */
export const computeMaxBorrowAmount = ({
  tag, // 逐仓才传，交易对
  currency, // 币种
  netAsset, // 账户净资产(BTC)
  liability, // 账户中币种的负债
  userLeverage, // 账户当前杠杆倍数
  totalLiability, // 账户总负债(BTC)
}) => {
  const state = getStore().getState();
  const { targetPriceMap } = state.isolated;
  const {
    borrowMinAmount,
    borrowMaxAmount,
    borrowCoefficient,
    currencyLoanMinUnit,
  } = getMarginCurrencyConfig({ tag, currency });
  const targetPrice = targetPriceMap[`${currency}-BTC`] || 0;
  return getMaxBorrowSize({
    coin: {
      liability,
      targetPrice,
      borrowMaxAmount,
      borrowMinAmount,
      borrowCoefficient,
      currencyLoanMinUnit,
    },
    netAsset,
    userLeverage,
    totalLiability,
  });
};
/**
 * @returns 从逐仓仓位数据中计算该仓位总负债(BTC)
 */
export const computeIsolatedTotalLiability = (positionData) => {
  try {
    const { baseAsset, quoteAsset } = positionData;
    const baseLiability = add(
      baseAsset.liabilityInterest,
      baseAsset.liabilityPrincipal,
    );
    const baseLiabilityBtc = currencyAmount2BtcAmount({
      amount: baseLiability,
      currency: baseAsset.currency,
    });
    const quoteLiability = add(
      quoteAsset.liabilityInterest,
      quoteAsset.liabilityPrincipal,
    );
    const quoteLiabilityBtc = currencyAmount2BtcAmount({
      amount: quoteLiability,
      currency: quoteAsset.currency,
    });
    return add(baseLiabilityBtc, quoteLiabilityBtc).toFixed();
  } catch (e) {
    return 0;
  }
};
/**
 * @returns 从逐仓仓位数据中计算该仓位折合保证金系数后的总资产(BTC)
 */
export const computeIsolatedTotalBalanceWithCoefficient = (positionData) => {
  try {
    const {
      currency: base,
      totalBalance: baseTotalBalance,
      marginCoefficient: baseMarginCoefficient,
    } = positionData.baseAsset;
    const {
      currency: quote,
      totalBalance: quoteTotalBalance,
      marginCoefficient: quoteMarginCoefficient,
    } = positionData.quoteAsset;
    const baseTotalBalanceBtc = currencyAmount2BtcAmount({
      currency: base,
      amount: baseTotalBalance,
    });
    const quoteTotalBalanceBtc = currencyAmount2BtcAmount({
      currency: quote,
      amount: quoteTotalBalance,
    });
    const baseTotalBalanceWithCoefficient = multiply(
      baseTotalBalanceBtc,
      baseMarginCoefficient,
    );
    const quoteTotalBalanceWithCoefficient = multiply(
      quoteTotalBalanceBtc,
      quoteMarginCoefficient,
    );
    return add(
      baseTotalBalanceWithCoefficient,
      quoteTotalBalanceWithCoefficient,
    ).toFixed();
  } catch (e) {
    return 0;
  }
};
/**
 * @returns 从逐仓仓位数据中计算该仓位净资产(BTC)
 */
export const computeIsolatedNetAsset = (positionData) => {
  const totalLiability = computeIsolatedTotalLiability(positionData);
  return getNetAsset(positionData?.totalConversionBalance, totalLiability);
};
/**
 * @returns 从逐仓仓位数据中计算该仓位折合保证金系数后净资产(BTC)
 */
export const computeIsolatedNetAssetWithCoefficient = (positionData) => {
  const totalLiability = computeIsolatedTotalLiability(positionData);
  const totalBalanceWithCoefficient = computeIsolatedTotalBalanceWithCoefficient(
    positionData,
  );
  return getNetAsset(totalBalanceWithCoefficient, totalLiability);
};
/**
 * @returns 从逐仓仓位数据中计算该仓位实际杠杆倍数
 */
export const computeIsolatedRealLeaverage = (positionData) => {
  try {
    const netAsset = computeIsolatedNetAsset(positionData);
    return getRealLeaverage(positionData?.totalConversionBalance, netAsset);
  } catch (e) {
    return 0;
  }
};
/**
 * @returns 从全仓仓位数据中计算该仓位实际杠杆倍数
 */
export const computeCrossRealLeaverage = (positionData) => {
  try {
    const { totalBalance, totalLiability } = positionData;
    const netAsset = getNetAsset(totalBalance, totalLiability);
    return getRealLeaverage(totalBalance, netAsset);
  } catch (e) {
    return 0;
  }
};
/**
 * @returns 计算逐仓仓位币种最大可借
 */
export const computeIsolatedBorrowAmount = ({
  positionData,
  currency,
  userLeverage,
}) => {
  try {
    const { tag } = positionData;
    const { isDebitEnabled } = getMarginCurrencyConfig({ tag, currency });
    if (!isDebitEnabled) return 0; // 不支持借贷的币种， 可借为0
    const pair = tag.split('-');
    userLeverage = userLeverage || positionData.userLeverage;
    const { liabilityInterest, liabilityPrincipal } = positionData[
      currency === pair[0] ? 'baseAsset' : 'quoteAsset'
    ];
    const liability = add(liabilityInterest, liabilityPrincipal);
    const totalLiability = computeIsolatedTotalLiability(positionData);
    const netAsset = computeIsolatedNetAssetWithCoefficient(positionData);
    return computeMaxBorrowAmount({
      tag: positionData.tag,
      currency,
      netAsset,
      liability,
      userLeverage,
      totalLiability,
    });
  } catch (e) {
    return 0;
  }
};
/**
 * @returns 计算全仓仓位币种最大可借
 */
export const computeCrossBorrowAmount = ({
  positionData,
  currency,
  userLeverage,
}) => {
  try {
    const { isDebitEnabled } = getMarginCurrencyConfig({ currency });
    if (!isDebitEnabled) return 0; // 不支持借贷的币种， 可借为0
    const {
      marginCoefficientTotalAsset,
      fundsInfoList,
      totalLiability,
    } = positionData;
    userLeverage = userLeverage || positionData.userLeverage;
    const { liability } = find(fundsInfoList, (v) => v.currency === currency);
    return computeMaxBorrowAmount({
      currency,
      liability,
      userLeverage,
      totalLiability,
      netAsset: getNetAsset(marginCoefficientTotalAsset, totalLiability),
    });
  } catch (e) {
    return 0;
  }
};
