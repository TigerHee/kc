/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2021-05-25 22:28:59
 * @Description: 杠杆全仓/逐仓数据整理
 */
import { includes } from 'lodash';
import { useSelector, shallowEqual } from 'dva';
import { STATUS, ACCOUNT_CODE } from 'components/KcTransferModal/config';
import { MARGIN_TRADE_TYPE } from './useTradeTypes';

// 下列对象只定义一次，避免每次state更新重新创建对象，导致页面频繁刷新
const plainObj = {};
const marginCoinsConfig = {};
const isolatedCoinsConfig = {};
const isolatedAccountConfig = {};
const plainArr = [];
const isolatedCoinList = [];

export default (keys) => {
  const marginModel = useSelector((state) => {
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
    const { currentSymbol, tradeType } = state.trade;
    const { marginMap, margin } = state.user_assets;
    const { isolatedSymbolsMap, marginSymbolsMap } = state.symbols;
    const {
      [MARGIN_TRADE_TYPE.MARGIN_TRADE.borrowTypeKey]: marginBorrowType,
      [MARGIN_TRADE_TYPE.MARGIN_ISOLATED_TRADE.borrowTypeKey]: isolatedBorrowType,
     } = state.tradeForm;
    const {
      isMarginEnabled = false,
      isIsolatedEnabled = false,
    } = marginSymbolsMap[currentSymbol] || {};
    const [base, quote] = currentSymbol.split('-');
    const {
      riskGrade,
      flDebtRatio,
      maxLeverage = 0,
      riskLeverage = 0,
      baseBorrowEnable,
      baseMaxBuyAmount,
      quoteBorrowEnable,
      quoteMaxBuyAmount,
      baseMaxBorrowAmount,
      quoteMaxBorrowAmount,
      liquidationDebtRatio,
      transferOutMaxDebtRatio,
      transferableAmountDebtRatio,
    } = isolatedSymbolsMap[currentSymbol] || {};
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
    } = positionMap[currentSymbol] || {};
    const {
      status: isolatedStatus,
      isAutoRepay: isolatedIsAutoRepay,
    } = tagMap[currentSymbol] || {};
    const { userLeverage: marginUserLeverage = 10, status: marginStatus } = userPosition || {};

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
      result.isAutoRepay = mergeAccountData(marginIsAutoRepay, isolatedIsAutoRepay, false);
    }
    if (!keys || includes(keys, 'userLeverage')) {
      result.userLeverage = mergeAccountData(marginUserLeverage, isolatedUserLeverage, 0);
    }
    if (!keys || includes(keys, 'accountConfigs')) {
      isolatedAccountConfig.riskGrade = riskGrade;
      isolatedAccountConfig.flDebtRatio = flDebtRatio;
      isolatedAccountConfig.maxLeverage = maxLeverage;
      isolatedAccountConfig.riskLeverage = riskLeverage;
      isolatedAccountConfig.liquidationDebtRatio = liquidationDebtRatio;
      isolatedAccountConfig.transferOutMaxDebtRatio = transferOutMaxDebtRatio;
      isolatedAccountConfig.transferableAmountDebtRatio = transferableAmountDebtRatio;
      result.accountConfigs = mergeAccountData(configs, isolatedAccountConfig) || plainObj;
    }
    if (!keys || includes(keys, 'totalBalance')) {
      result.totalBalance = mergeAccountData(marginTotalBalance, isolatedTotalBalance, 0);
    }
    if (!keys || includes(keys, 'totalLiability')) {
      result.totalLiability = mergeAccountData(marginTotalLiability, isolatedTotalLiability, 0);
    }
    if (!keys || includes(keys, 'liabilityRate')) {
      result.liabilityRate = mergeAccountData(marginLiabilityRate, isolatedLiabilityRate, 0);
    }
    if (!keys || includes(keys, 'position')) {
      result.position = mergeAccountData(marginMap, positionMap[currentSymbol]) || plainObj;
    }
    if (!keys || includes(keys, 'borrowSizeMap')) {
      result.borrowSizeMap = mergeAccountData(
        marginBorrowSizeMap,
        isolatedBorrowSizeMap,
      ) || plainObj;
    }
    if (!keys || includes(keys, 'isEnabled')) {
      result.isEnabled = mergeAccountData(isMarginEnabled, isIsolatedEnabled, true);
    }
    if (!keys || includes(keys, 'statusInfo')) {
      result.statusInfo = mergeAccountData(
        STATUS[ACCOUNT_CODE.MARGIN][marginStatus],
        STATUS[ACCOUNT_CODE.ISOLATED][isolatedStatus],
      ) || plainObj;
    }
    if (!keys || includes(keys, 'borrowType')) {
      result.borrowType = mergeAccountData(marginBorrowType, isolatedBorrowType, '');
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
      marginCoinsConfig[base] = {
        buyMaxAmount: baseMarginBuyMaxAmount,
        isDebitEnabled: baseMarginBorrowEnabled,
        borrowMaxAmount: baseMarginBorrowMaxAmount,
        ...baseCommonConfig,
      };
      marginCoinsConfig[quote] = {
        buyMaxAmount: quoteMarginBuyMaxAmount,
        isDebitEnabled: quoteMarginBorrowEnabled,
        borrowMaxAmount: quoteMarginBorrowMaxAmount,
        ...quoteCommonConfig,
      };
      isolatedCoinsConfig[base] = {
        buyMaxAmount: baseMaxBuyAmount,
        isDebitEnabled: baseBorrowEnable,
        borrowMaxAmount: baseMaxBorrowAmount,
        ...baseCommonConfig,
      };
      isolatedCoinsConfig[quote] = {
        buyMaxAmount: quoteMaxBuyAmount,
        isDebitEnabled: quoteBorrowEnable,
        borrowMaxAmount: quoteMaxBorrowAmount,
        ...quoteCommonConfig,
      };
      result.coinsConfig =
        mergeAccountData(marginCoinsConfig, isolatedCoinsConfig) || plainObj;
    }
    return result;
  }, shallowEqual);
  return marginModel;
};
