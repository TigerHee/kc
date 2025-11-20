/**
 * @owner: borden@kupotech.com
 * @Description: 杠杆全仓/逐仓数据整理
 */
import { includes, isEqual } from 'lodash';
import { useSelector, shallowEqual } from 'dva';
import { getStateFromStore } from '@/utils/stateGetter';
import { MARGIN_TRADE_TYPE } from '@/meta/tradeTypes';
import { STATUS } from '@/meta/margin';
import { ACCOUNT_CODE } from '@/meta/const';

// 下列对象只定义一次，避免每次state更新重新创建对象，导致页面频繁刷新
const plainObj = {};
const plainArr = [];
const isolatedCoinList = [];
let marginCoinsConfig = null;
let isolatedCoinsConfig = null;
let isolatedAccountConfig = null;

export default function useMarginModel(keys, params) {
  const marginModel = useSelector((state) => {
    const symbol = params?.symbol || state.trade.currentSymbol;
    const tradeType = params?.tradeType || state.trade.tradeType;
    const result = {};

    const {
      tagMap,
      positionMap,
      borrowSizeMap: isolatedBorrowSizeMap,
    } = state.isolated;
    const {
      configs,
      userPosition,
      positionDetail,
      loanCurrenciesMap,
      crossCurrenciesMap,
      liabilityRate: marginLiabilityRate,
      borrowSizeMap: marginBorrowSizeMap,
    } = state.marginMeta;
    const { marginMap, margin } = state.user_assets;
    const { isolatedSymbolsMap, marginSymbolsMap } = state.symbols;
    const {
      [MARGIN_TRADE_TYPE.MARGIN_TRADE.borrowTypeKey]: marginBorrowType,
      [MARGIN_TRADE_TYPE.MARGIN_ISOLATED_TRADE
        .borrowTypeKey]: isolatedBorrowType,
    } = state.tradeForm;
    const { isMarginEnabled = false, isIsolatedEnabled = false } =
      marginSymbolsMap[symbol] || {};
    const [base, quote] = symbol.split('-');
    const {
      baseBorrowEnable,
      baseMaxBuyAmount,
      quoteBorrowEnable,
      quoteMaxBuyAmount,
      baseMaxBorrowAmount,
      quoteMaxBorrowAmount,
    } = isolatedSymbolsMap[symbol] || {};
    const {
      isAutoRepay: marginIsAutoRepay,
      totalBalance: marginTotalBalance,
      totalLiability: marginTotalLiability,
    } = positionDetail;
    const {
      [base]: baseAsset,
      [quote]: quoteAsset,
      userLeverage: isolatedUserLeverage,
      totalConversionBalance: isolatedTotalBalance,
      totalConversionLiability: isolatedTotalLiability,
      liabilityRate: isolatedLiabilityRate,
    } = positionMap[symbol] || {};
    const { status: isolatedStatus, isAutoRepay: isolatedIsAutoRepay } =
      tagMap[symbol] || {};
    const { userLeverage: marginUserLeverage = 10, status: marginStatus } =
      userPosition || {};

    const mergeAccountData = (a, b, c) => {
      if (tradeType === MARGIN_TRADE_TYPE.MARGIN_TRADE.key) {
        return a;
      } else if (tradeType === MARGIN_TRADE_TYPE.MARGIN_ISOLATED_TRADE.key) {
        return b;
      }
      return c;
    };

    if (!keys || includes(keys, 'coinList')) {
      isolatedCoinList[0] = baseAsset;
      isolatedCoinList[1] = quoteAsset;
      result.coinList = mergeAccountData(margin, isolatedCoinList, plainArr);
    }
    if (!keys || includes(keys, 'isAutoRepay')) {
      result.isAutoRepay = mergeAccountData(
        marginIsAutoRepay,
        isolatedIsAutoRepay,
        false,
      );
    }
    if (!keys || includes(keys, 'userLeverage')) {
      result.userLeverage = mergeAccountData(
        marginUserLeverage,
        isolatedUserLeverage,
        0,
      );
    }
    if (!keys || includes(keys, 'accountConfigs')) {
      if (
        isolatedSymbolsMap[symbol] &&
        isolatedAccountConfig?.symbol !== symbol
      ) {
        isolatedAccountConfig = { ...isolatedSymbolsMap[symbol] };
      }
      result.accountConfigs =
        mergeAccountData(configs, isolatedAccountConfig) || plainObj;
    }
    if (!keys || includes(keys, 'totalBalance')) {
      result.totalBalance = mergeAccountData(
        marginTotalBalance,
        isolatedTotalBalance,
        0,
      );
    }
    if (!keys || includes(keys, 'totalLiability')) {
      result.totalLiability = mergeAccountData(
        marginTotalLiability,
        isolatedTotalLiability,
        0,
      );
    }
    if (!keys || includes(keys, 'liabilityRate')) {
      result.liabilityRate = mergeAccountData(
        marginLiabilityRate,
        isolatedLiabilityRate,
        0,
      );
    }
    if (!keys || includes(keys, 'position')) {
      result.position =
        mergeAccountData(marginMap, positionMap[symbol]) || plainObj;
    }
    if (!keys || includes(keys, 'borrowSizeMap')) {
      result.borrowSizeMap =
        mergeAccountData(marginBorrowSizeMap, isolatedBorrowSizeMap) ||
        plainObj;
    }
    if (!keys || includes(keys, 'isEnabled')) {
      result.isEnabled = mergeAccountData(
        isMarginEnabled,
        isIsolatedEnabled,
        true,
      );
    }
    if (!keys || includes(keys, 'statusInfo')) {
      result.statusInfo =
        mergeAccountData(
          STATUS[ACCOUNT_CODE.MARGIN][marginStatus],
          STATUS[ACCOUNT_CODE.ISOLATED][isolatedStatus],
        ) || plainObj;
    }
    if (!keys || includes(keys, 'borrowType')) {
      result.borrowType = mergeAccountData(
        marginBorrowType,
        isolatedBorrowType,
        '',
      );
    }
    if (!keys || includes(keys, 'coinsConfig')) {
      const {
        borrowMinAmount: baseBorrowMinAmount = 0,
        currencyLoanMinUnit: baseCurrencyLoanMinUnit = 0,
        marginBorrowEnabled: baseMarginBorrowEnabled,
      } = loanCurrenciesMap[base] || {};
      const {
        buyMaxAmount: baseMarginBuyMaxAmount,
        borrowMaxAmount: baseMarginBorrowMaxAmount = 0,
      } = crossCurrenciesMap[base] || {};
      const {
        borrowMinAmount: quoteBorrowMinAmount = 0,
        currencyLoanMinUnit: quoteCurrencyLoanMinUnit = 0,
        marginBorrowEnabled: quoteMarginBorrowEnabled,
      } = loanCurrenciesMap[quote] || {};
      const {
        buyMaxAmount: quoteMarginBuyMaxAmount,
        borrowMaxAmount: quoteMarginBorrowMaxAmount = 0,
      } = crossCurrenciesMap[quote] || {};
      const baseCommonConfig = {
        borrowMinAmount: baseBorrowMinAmount,
        currencyLoanMinUnit: baseCurrencyLoanMinUnit,
      };
      const quoteCommonConfig = {
        borrowMinAmount: quoteBorrowMinAmount,
        currencyLoanMinUnit: quoteCurrencyLoanMinUnit,
      };
      const nextMarginCoinsConfig = {
        [base]: {
          buyMaxAmount: baseMarginBuyMaxAmount,
          isDebitEnabled: baseMarginBorrowEnabled,
          borrowMaxAmount: baseMarginBorrowMaxAmount,
          ...baseCommonConfig,
        },
        [quote]: {
          buyMaxAmount: quoteMarginBuyMaxAmount,
          isDebitEnabled: quoteMarginBorrowEnabled,
          borrowMaxAmount: quoteMarginBorrowMaxAmount,
          ...quoteCommonConfig,
        },
      };
      const nextIsolatedCoinsConfig = {
        [base]: {
          buyMaxAmount: baseMaxBuyAmount,
          isDebitEnabled: baseBorrowEnable,
          borrowMaxAmount: baseMaxBorrowAmount,
          ...baseCommonConfig,
        },
        [quote]: {
          buyMaxAmount: quoteMaxBuyAmount,
          isDebitEnabled: quoteBorrowEnable,
          borrowMaxAmount: quoteMaxBorrowAmount,
          ...quoteCommonConfig,
        },
      };
      if (!isEqual(marginCoinsConfig, nextMarginCoinsConfig)) {
        marginCoinsConfig = nextMarginCoinsConfig;
      }
      if (!isEqual(isolatedCoinsConfig, nextIsolatedCoinsConfig)) {
        isolatedCoinsConfig = nextIsolatedCoinsConfig;
      }
      result.coinsConfig =
        mergeAccountData(marginCoinsConfig, isolatedCoinsConfig) || plainObj;
    }
    return result;
  }, shallowEqual);
  return marginModel;
}

export function getMarginModel(keys, params) {
  const marginModel = getStateFromStore((state) => {
    const symbol = params?.symbol || state.trade.currentSymbol;
    const tradeType = params?.tradeType || state.trade.tradeType;
    const result = {};

    const {
      tagMap,
      positionMap,
      borrowSizeMap: isolatedBorrowSizeMap,
    } = state.isolated;
    const {
      configs,
      userPosition,
      positionDetail,
      loanCurrenciesMap,
      crossCurrenciesMap,
      liabilityRate: marginLiabilityRate,
      borrowSizeMap: marginBorrowSizeMap,
    } = state.marginMeta;
    const { marginMap, margin } = state.user_assets;
    const { isolatedSymbolsMap, marginSymbolsMap } = state.symbols;
    const {
      [MARGIN_TRADE_TYPE.MARGIN_TRADE.borrowTypeKey]: marginBorrowType,
      [MARGIN_TRADE_TYPE.MARGIN_ISOLATED_TRADE
        .borrowTypeKey]: isolatedBorrowType,
    } = state.tradeForm;
    const { isMarginEnabled = false, isIsolatedEnabled = false } =
      marginSymbolsMap[symbol] || {};
    const [base, quote] = symbol.split('-');
    const {
      baseBorrowEnable,
      baseMaxBuyAmount,
      quoteBorrowEnable,
      quoteMaxBuyAmount,
      baseMaxBorrowAmount,
      quoteMaxBorrowAmount,
    } = isolatedSymbolsMap[symbol] || {};
    const {
      isAutoRepay: marginIsAutoRepay,
      totalBalance: marginTotalBalance,
      totalLiability: marginTotalLiability,
    } = positionDetail;
    const {
      [base]: baseAsset,
      [quote]: quoteAsset,
      userLeverage: isolatedUserLeverage,
      totalConversionBalance: isolatedTotalBalance,
      totalConversionLiability: isolatedTotalLiability,
      liabilityRate: isolatedLiabilityRate,
    } = positionMap[symbol] || {};
    const { status: isolatedStatus, isAutoRepay: isolatedIsAutoRepay } =
      tagMap[symbol] || {};
    const { userLeverage: marginUserLeverage = 10, status: marginStatus } =
      userPosition || {};

    const mergeAccountData = (a, b, c) => {
      if (tradeType === MARGIN_TRADE_TYPE.MARGIN_TRADE.key) {
        return a;
      } else if (tradeType === MARGIN_TRADE_TYPE.MARGIN_ISOLATED_TRADE.key) {
        return b;
      }
      return c;
    };

    if (!keys || includes(keys, 'coinList')) {
      result.coinList = mergeAccountData(
        margin,
        [baseAsset, quoteAsset],
        plainArr,
      );
    }
    if (!keys || includes(keys, 'isAutoRepay')) {
      result.isAutoRepay = mergeAccountData(
        marginIsAutoRepay,
        isolatedIsAutoRepay,
        false,
      );
    }
    if (!keys || includes(keys, 'userLeverage')) {
      result.userLeverage = mergeAccountData(
        marginUserLeverage,
        isolatedUserLeverage,
        0,
      );
    }
    if (!keys || includes(keys, 'accountConfigs')) {
      result.accountConfigs =
        mergeAccountData(configs, isolatedSymbolsMap[symbol]) || plainObj;
    }
    if (!keys || includes(keys, 'totalBalance')) {
      result.totalBalance = mergeAccountData(
        marginTotalBalance,
        isolatedTotalBalance,
        0,
      );
    }
    if (!keys || includes(keys, 'totalLiability')) {
      result.totalLiability = mergeAccountData(
        marginTotalLiability,
        isolatedTotalLiability,
        0,
      );
    }
    if (!keys || includes(keys, 'liabilityRate')) {
      result.liabilityRate = mergeAccountData(
        marginLiabilityRate,
        isolatedLiabilityRate,
        0,
      );
    }
    if (!keys || includes(keys, 'position')) {
      result.position =
        mergeAccountData(marginMap, positionMap[symbol]) || plainObj;
    }
    if (!keys || includes(keys, 'borrowSizeMap')) {
      result.borrowSizeMap =
        mergeAccountData(marginBorrowSizeMap, isolatedBorrowSizeMap) ||
        plainObj;
    }
    if (!keys || includes(keys, 'isEnabled')) {
      result.isEnabled = mergeAccountData(
        isMarginEnabled,
        isIsolatedEnabled,
        true,
      );
    }
    if (!keys || includes(keys, 'statusInfo')) {
      result.statusInfo =
        mergeAccountData(
          STATUS[ACCOUNT_CODE.MARGIN][marginStatus],
          STATUS[ACCOUNT_CODE.ISOLATED][isolatedStatus],
        ) || plainObj;
    }
    if (!keys || includes(keys, 'borrowType')) {
      result.borrowType = mergeAccountData(
        marginBorrowType,
        isolatedBorrowType,
        '',
      );
    }
    if (!keys || includes(keys, 'coinsConfig')) {
      const {
        borrowMinAmount: baseBorrowMinAmount = 0,
        currencyLoanMinUnit: baseCurrencyLoanMinUnit = 0,
        marginBorrowEnabled: baseMarginBorrowEnabled,
      } = loanCurrenciesMap[base] || {};
      const {
        buyMaxAmount: baseMarginBuyMaxAmount,
        borrowMaxAmount: baseMarginBorrowMaxAmount = 0,
      } = crossCurrenciesMap[base] || {};
      const {
        borrowMinAmount: quoteBorrowMinAmount = 0,
        currencyLoanMinUnit: quoteCurrencyLoanMinUnit = 0,
        marginBorrowEnabled: quoteMarginBorrowEnabled,
      } = loanCurrenciesMap[quote] || {};
      const {
        buyMaxAmount: quoteMarginBuyMaxAmount,
        borrowMaxAmount: quoteMarginBorrowMaxAmount = 0,
      } = crossCurrenciesMap[quote] || {};
      const baseCommonConfig = {
        borrowMinAmount: baseBorrowMinAmount,
        currencyLoanMinUnit: baseCurrencyLoanMinUnit,
      };
      const quoteCommonConfig = {
        borrowMinAmount: quoteBorrowMinAmount,
        currencyLoanMinUnit: quoteCurrencyLoanMinUnit,
      };
      const nextMarginCoinsConfig = {
        [base]: {
          buyMaxAmount: baseMarginBuyMaxAmount,
          isDebitEnabled: baseMarginBorrowEnabled,
          borrowMaxAmount: baseMarginBorrowMaxAmount,
          ...baseCommonConfig,
        },
        [quote]: {
          buyMaxAmount: quoteMarginBuyMaxAmount,
          isDebitEnabled: quoteMarginBorrowEnabled,
          borrowMaxAmount: quoteMarginBorrowMaxAmount,
          ...quoteCommonConfig,
        },
      };
      const nextIsolatedCoinsConfig = {
        [base]: {
          buyMaxAmount: baseMaxBuyAmount,
          isDebitEnabled: baseBorrowEnable,
          borrowMaxAmount: baseMaxBorrowAmount,
          ...baseCommonConfig,
        },
        [quote]: {
          buyMaxAmount: quoteMaxBuyAmount,
          isDebitEnabled: quoteBorrowEnable,
          borrowMaxAmount: quoteMaxBorrowAmount,
          ...quoteCommonConfig,
        },
      };
      result.coinsConfig =
        mergeAccountData(nextMarginCoinsConfig, nextIsolatedCoinsConfig) ||
        plainObj;
    }
    return result;
  });
  return marginModel;
}
