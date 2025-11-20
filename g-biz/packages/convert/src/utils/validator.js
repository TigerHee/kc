/*
 * @owner: borden@kupotech.com
 */
import { isNil } from 'lodash';
import i18n from '@tools/i18n';
import getStore from './getStore';
import { getMax, getSymbolConfig } from './tools';
import { NAMESPACE, ORDER_TYPE_ENUM } from '../config';
import { isFinite, comparedTo, formatNumber, isDivisible } from './format';

const options = { dp: null };

export const fromCurrencySizeValidator = async (value, isEstimateField) => {
  const store = await getStore();
  const { accountType, positions, fromCurrency, toCurrency, orderType, convertSymbolsMap } =
    store[NAMESPACE] || {};
  const { minQuoteSize, maxQuoteSize, tickSize } = getSymbolConfig(
    toCurrency,
    fromCurrency,
    convertSymbolsMap?.[orderType],
  );

  if (isNil(value)) {
    return Promise.resolve();
  }
  // min
  if (
    isFinite(minQuoteSize) &&
    comparedTo(value, minQuoteSize) < 0 &&
    (!isEstimateField || orderType === ORDER_TYPE_ENUM.LIMIT)
  ) {
    return Promise.reject(
      new Error(
        i18n.t('convert:kQQBoBMkcE9H49pAcXsnSc', {
          min: formatNumber(minQuoteSize, options),
          max: formatNumber(maxQuoteSize, options),
        }),
      ),
    );
  }
  // precision
  if (
    !(isEstimateField && orderType === ORDER_TYPE_ENUM.MARKET) &&
    isFinite(tickSize) &&
    !isDivisible(value, tickSize)
  ) {
    return Promise.reject(
      new Error(i18n.t('convert:4L7PoxhUmmjnuHg2r1NLR6', { amount: tickSize })),
    );
  }
  // max
  const balance = positions?.[accountType]?.[fromCurrency];
  const max = getMax({ balance, max: maxQuoteSize });
  if (isFinite(max) && comparedTo(value, max) > 0) {
    return Promise.reject(
      new Error(
        comparedTo(max, balance) === 0
          ? i18n.t('convert:9jfwpLVHz6w8gPWMJRYAtZ')
          : i18n.t('convert:kQQBoBMkcE9H49pAcXsnSc', {
              min: formatNumber(minQuoteSize, options),
              max: formatNumber(maxQuoteSize, options),
            }),
      ),
    );
  }

  return Promise.resolve();
};

export const toCurrencySizeValidator = async (value, isEstimateField) => {
  const store = await getStore();
  const { fromCurrency, toCurrency, orderType, convertSymbolsMap } = store[NAMESPACE] || {};
  const { minBaseSize, maxBaseSize, stepSize } = getSymbolConfig(
    toCurrency,
    fromCurrency,
    convertSymbolsMap?.[orderType],
  );

  if (isNil(value)) {
    return Promise.resolve();
  }
  // min & max
  if (
    (isFinite(maxBaseSize) && comparedTo(value, maxBaseSize) > 0) ||
    (isFinite(minBaseSize) &&
      comparedTo(minBaseSize, value) > 0 &&
      (!isEstimateField || orderType === ORDER_TYPE_ENUM.LIMIT))
  ) {
    return Promise.reject(
      new Error(
        i18n.t('convert:kQQBoBMkcE9H49pAcXsnSc', {
          min: formatNumber(minBaseSize, options),
          max: formatNumber(maxBaseSize, options),
        }),
      ),
    );
  }

  // precision, 临时放开市价单预估字段的精度校验
  if (
    !(isEstimateField && orderType === ORDER_TYPE_ENUM.MARKET) &&
    isFinite(stepSize) &&
    !isDivisible(value, stepSize)
  ) {
    return Promise.reject(
      new Error(i18n.t('convert:4L7PoxhUmmjnuHg2r1NLR6', { amount: stepSize })),
    );
  }

  return Promise.resolve();
};
