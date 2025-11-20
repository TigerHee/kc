/**
 * Owner: odan.ou@kupotech.com
 */

import Decimal from 'decimal.js/decimal';

/**
 * 判断是否满足最小精度
 * @param {any} val
 * @param {number} step
 */
export const isMinStep = (val, step) => {
  return +Decimal.mod(val, step || 1).toFixed() === 0;
};

/**
 * 多语言下的数字formatter
 * @param {str} lang
 * @param {number} number
 * @param {*} options
 */
export function formatNumber(lang, number, options = {}) {
  const _lang = (lang || 'en_US').replace('_', '-');
  const numberFormat = new Intl.NumberFormat(_lang, {
    maximumFractionDigits: 8,
    ...options,
  });
  return numberFormat.format(number);
}
