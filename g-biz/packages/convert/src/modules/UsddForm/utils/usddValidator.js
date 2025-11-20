/*
 * @owner: june.lee@kupotech.com
 */
import { isNil } from 'lodash';
import i18n from '@tools/i18n';
import getStore from '../../../utils/getStore';
import { getMax } from '../../../utils/tools';
import { isFinite, comparedTo, formatNumber, isDivisible } from '../../../utils/format';
import { NAMESPACE } from '../../../config';

const options = { dp: null };

export const fromCurrencySizeValidator = async (value, isEstimateField) => {
  const store = await getStore();
  const { accountType, positions, fromCurrencyUSDD, convertSymbolsMap } = store[NAMESPACE] || {};
  const convertSymbolsMapUSDD = convertSymbolsMap?.USDD || {};
  const { maxSize: maxQuoteSize, minSize: minQuoteSize, step: tickSize } =
    convertSymbolsMapUSDD[fromCurrencyUSDD] ?? {};

  if (isNil(value)) {
    return Promise.resolve();
  }
  // min
  if (isFinite(minQuoteSize) && comparedTo(value, minQuoteSize) < 0 && !isEstimateField) {
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
  if (!isEstimateField && isFinite(tickSize) && !isDivisible(value, tickSize)) {
    return Promise.reject(
      new Error(i18n.t('convert:4L7PoxhUmmjnuHg2r1NLR6', { amount: tickSize })),
    );
  }
  // max
  const balance = positions?.[accountType]?.[fromCurrencyUSDD];
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
  const { toCurrencyUSDD, convertSymbolsMap } = store[NAMESPACE] || {};
  const convertSymbolsMapUSDD = convertSymbolsMap?.USDD || {};
  const { maxSize: maxBaseSize, minSize: minBaseSize, step: stepSize } =
    convertSymbolsMapUSDD[toCurrencyUSDD] ?? {};

  if (isNil(value)) {
    return Promise.resolve();
  }
  // min & max
  if (
    (isFinite(maxBaseSize) && comparedTo(value, maxBaseSize) > 0) ||
    (isFinite(minBaseSize) && comparedTo(minBaseSize, value) > 0 && !isEstimateField)
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
  if (!isEstimateField && isFinite(stepSize) && !isDivisible(value, stepSize)) {
    return Promise.reject(
      new Error(i18n.t('convert:4L7PoxhUmmjnuHg2r1NLR6', { amount: stepSize })),
    );
  }

  return Promise.resolve();
};
