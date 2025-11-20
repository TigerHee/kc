/**
 * Owner: garuda@kupotech.com
 */

import Decimal from 'decimal.js';
import { formatCurrency } from './formatCurrency';

// 显示一个单位换算提示
export function quantityPlaceholder(
  { quoteCurrency, baseCurrency, isInverse, multiplier = 0.01 },
  _t,
) {
  return `1 ${_t('global.unit')} = ${new Decimal(multiplier).abs().toFixed()} ${
    isInverse ? quoteCurrency : formatCurrency(baseCurrency)
  }`;
}
