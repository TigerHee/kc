/**
 * @Owner: borden@kupotech.com
 * @Date: 2021-05-16 16:35:42
 * @Description: 借币/还币相关配置
 */
import { includes, find, split, isNil } from 'lodash';
import { _t } from 'src/utils/lang';
import { min } from 'src/utils/operation';
import { getBorrowSize } from 'src/services/margin';
import { getIsolatedAppoint } from 'src/services/isolated';
import { sub, add, dropZero, getPrecisionFromIncrement } from 'src/helper';
import { ACCOUNT_CODE } from '@/meta/const';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import {
  getStateFromStore,
  getMarginCurrencyConfig,
} from '@/utils/stateGetter';
import { getCurrentSymbol } from '@/hooks/common/useSymbol';
import {
  checkCurrencyIsSupportCrossLoan,
  checkCurrencyIsSupportIsolatedLoan,
} from './utils';

// 杠杆计息精度
export const INTEREST_PRECISION = 8;

// 弹窗类型(借币 ｜ 还币)
export const MODAL_TYPE = [
  {
    value: 'borrow',
    label: () => _t('margin.borrow'),
    showDict: true,
    getMaxSize: (currencyPosition) => {
      return currencyPosition?.borrowAmount;
    },
    maxInputSizeKey: 'borrowAmount',
    sortor: {
      key: 'availableBtc',
      displayKey: 'availableBalance',
      label: () => _t('bv4u5WW4GNncSY7BfkJmus'),
    },
    postEffect: (tradeType) => TRADE_TYPES_CONFIG[tradeType]?.postBorrowEffect,
    defaultParams: {
      channel: 'WEB',
      period: '7,14,28',
      borrowStrategy: 'FOK',
    },
    postCallback: ({ data, size, currencyName, message }) => {
      data.actualSize = +data.actualSize;
      if (data.actualSize === +size) {
        message.success(
          _t('margin.borrow.order.filled', {
            number: data.actualSize,
            coin: currencyName,
          }),
        );
      } else if (data.actualSize > 0) {
        message.success(
          _t('margin.borrow.ioc.filled', {
            number: data.actualSize,
            coin: currencyName,
          }),
        );
      } else {
        message.info(_t('margin.borrow.koc.cancled'));
      }
    },
    validatorSize: ({ max, value, tag, currency }) => {
      if (isNil(value)) {
        return Promise.resolve();
      }
      value = +value;
      const {
        borrowMaxAmount,
        borrowMinAmount,
        currencyLoanMinUnit,
      } = getMarginCurrencyConfig({ tag, currency });
      const borrowMaxNum = +borrowMaxAmount;
      const borrowMinNum = +borrowMinAmount;
      const realMax = borrowMaxNum > max ? max : borrowMaxNum;
      if (value > realMax) {
        return Promise.reject(`${_t('margin.borrow.max.amount')}${realMax}`);
      }
      if (value < borrowMinNum) {
        return Promise.reject(
          `${_t('margin.borrow.min.amount')}${borrowMinNum}`,
        );
      }
      const valuePrecision = getPrecisionFromIncrement(value);
      const currencyPrecision = getPrecisionFromIncrement(currencyLoanMinUnit);
      if (valuePrecision > currencyPrecision) {
        return Promise.reject(
          `${_t('margin.amount.precision.tip')}${currencyLoanMinUnit}`,
        );
      }
      return Promise.resolve();
    },
    positionInfoKeys: [
      'referRate',
      'liability',
      'availableBalance',
      'borrowAmount',
      'interestFreeCoupon',
    ],
    getSizePrecision: ({ tag, currency }) => {
      const { currencyLoanMinUnit } = getMarginCurrencyConfig({
        tag,
        currency,
      });
      return getPrecisionFromIncrement(currencyLoanMinUnit);
    },
  },
  {
    value: 'repay',
    label: () => _t('margin.repay.coin'),
    getMaxSize: (currencyPosition) => {
      return min(currencyPosition?.availableBalance, currencyPosition?.liability);
    },
    maxInputSizeKey: 'availableBalance',
    sortor: {
      key: 'liabilityBtc',
      displayKey: 'liability',
      label: () => _t('192aSr8iuJPjs2fviG8dvg'),
    },
    postEffect: (tradeType) => TRADE_TYPES_CONFIG[tradeType]?.postRepayEffect,
    defaultParams: {
      channel: 'WEB',
    },
    postCallback: ({ size, liability, currencyName, message }) => {
      let leftoverLiability = dropZero(sub(liability, size));
      if (+leftoverLiability < 0) leftoverLiability = 0;
      message.success(
        _t('margin.repay.successTip', {
          currency: currencyName,
          num: `${leftoverLiability}`,
        }),
      );
    },
    validatorSize: ({ max, value }) => {
      if (isNil(value)) {
        return Promise.resolve();
      }
      value = +value;
      if (value > max) {
        return Promise.reject(_t('margin.amount.not.enough'));
      }
      const valuePrecision = getPrecisionFromIncrement(value);
      // 计息是固定的8位精度，所以还款也就是固定的8位
      if (valuePrecision > INTEREST_PRECISION) {
        return Promise.reject(
          `${_t('margin.amount.precision.tip')}${INTEREST_PRECISION}`,
        );
      }
      return Promise.resolve();
    },
    positionInfoKeys: ['liability', 'availableBalance'],
    getSizePrecision: () => INTEREST_PRECISION,
  },
];

// 账户类型
export const ACCOUNT_TYPE = [
  {
    value: TRADE_TYPES_CONFIG.MARGIN_TRADE.key,
    label: TRADE_TYPES_CONFIG.MARGIN_TRADE.label2,
    getInitDict: TRADE_TYPES_CONFIG.MARGIN_TRADE.initDict,
    getPositionKey: () => TRADE_TYPES_CONFIG.MARGIN_TRADE.key,
    accountCode: ACCOUNT_CODE.MARGIN,
    checkCurrencyIsSupportLoan: checkCurrencyIsSupportCrossLoan,
    pullPostionByCurrency: ({ currency, callback }) => {
      getBorrowSize({ currency }).then((res) => {
        if (res?.success && typeof callback === 'function') {
          const {
            userLeverage,
            actualLoanSize,
            liability,
            availableBalance,
          } = res.data;
          callback({
            userLeverage,
            [currency]: {
              liability,
              availableBalance,
              borrowAmount: actualLoanSize,
            },
          });
        }
      });
    },
    checkTransferIsChangePosition: ({ from, to }) => {
      const [toAccountType] = to;
      const [fromAccountType] = from;
      return includes([toAccountType, fromAccountType], ACCOUNT_CODE.MARGIN);
    },
    checkTransferAction: ({ from, to }) => {
      const [toAccountType] = to;
      const [fromAccountType] = from;
      return includes([toAccountType, fromAccountType], ACCOUNT_CODE.MARGIN);
    },
    getInitTagForLeverageModal: ({ tag, currency }) => {
      tag = tag || getCurrentSymbol();
      const pair = split(tag, '-');
      if (pair.includes(currency)) {
        return tag;
      } else if (currency === 'USDT') {
        return 'BTC-USDT';
      }
      return `${currency}-USDT`;
    },
  },
  {
    value: TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key,
    label: TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.label2,
    getInitDict: (symbol) => {
      if (!symbol) return '';
      return TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.initDict(symbol);
    },
    getPositionKey: (symbol) =>
      `${TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key}_${symbol}`,
    showTagField: true,
    checkCurrencyIsSupportLoan: checkCurrencyIsSupportIsolatedLoan,
    pullPostionByTag: ({ callback, tag }) => {
      getIsolatedAppoint({ tag }).then((res) => {
        if (res?.success && typeof callback === 'function') {
          const { userLeverage, baseAsset, quoteAsset } = res.data;
          const {
            currency: base,
            holdBalance: baseHoldBalance,
            totalBalance: baseTotalBalance,
            borrowAmount: baseBorrowAmount,
            liabilityInterest: baseLiabilityInterest,
            liabilityPrincipal: baseLiabilityPrincipal,
          } = baseAsset;
          const {
            currency: quote,
            holdBalance: quoteHoldBalance,
            totalBalance: quoteTotalBalance,
            borrowAmount: quoteBorrowAmount,
            liabilityInterest: quoteLiabilityInterest,
            liabilityPrincipal: quoteLiabilityPrincipal,
          } = quoteAsset;
          callback(
            {
              userLeverage,
              [base]: {
                borrowAmount: baseBorrowAmount,
                availableBalance: sub(
                  baseTotalBalance,
                  baseHoldBalance,
                ).toFixed(),
                liability: add(
                  baseLiabilityInterest,
                  baseLiabilityPrincipal,
                ).toFixed(),
              },
              [quote]: {
                borrowAmount: quoteBorrowAmount,
                availableBalance: sub(
                  quoteTotalBalance,
                  quoteHoldBalance,
                ).toFixed(),
                liability: add(
                  quoteLiabilityInterest,
                  quoteLiabilityPrincipal,
                ).toFixed(),
              },
            },
            tag,
          );
        }
      });
    },
    checkTransferIsChangePosition: ({ from, to, tag }) => {
      const [toAccountType, toSymbol] = to;
      const [fromAccountType, fromSymbol] = from;
      return includes(
        [`${toAccountType}-${toSymbol}`, `${fromAccountType}-${fromSymbol}`],
        `${ACCOUNT_CODE.ISOLATED}-${tag}`,
      );
    },
    getInitTagForLeverageModal: ({ tag }) => tag,
    getInitTag: ({ currency }) => {
      const { currentSymbol } = getStateFromStore((state) => state.trade);
      const { isolatedSymbols, isolatedSymbolsMap } = getStateFromStore(
        (state) => state.symbols,
      );
      const prioritySymbols = [
        includes(split(currentSymbol, '-'), currency) ? currentSymbol : null,
        currency === 'USDT' ? `BTC-${currency}` : `${currency}-USDT`,
      ];
      const prioritySymbol = find(
        prioritySymbols,
        (v) => isolatedSymbolsMap?.[v],
      );
      if (prioritySymbol) return prioritySymbol;
      let symbolEqualBase;
      const symbolEqualQuote = find(isolatedSymbols, (v) => {
        const pair = split(v.symbol, '-');
        if (!symbolEqualBase && pair[0] === currency) {
          symbolEqualBase = v;
        }
        return pair[1] === currency;
      });
      return symbolEqualQuote?.symbol || symbolEqualBase?.symbol || 'BTC-USDT';
    },
  },
];

// 账户类型map
export const ACCOUNT_TYPE_MAP = ACCOUNT_TYPE.reduce((a, b) => {
  a[b.value] = b;
  return a;
}, {});
