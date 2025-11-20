import React from 'react';
import { getDigit, multiplyFloor } from 'helper';
import { formatCurrency } from 'src/trade4.0/utils/futures';
/**
 * Owner: clyne@kupotech.com
 */
import { _t } from 'src/utils/lang';
import AmountPrecision from './AmountPrecision';
import { QUANTITY_UNIT } from 'src/trade4.0/meta/futures';

export function ContractUnitText(props) {
  const { tradingUnit = QUANTITY_UNIT, contract } = props || {};
  const { baseCurrency } = contract || {};
  return tradingUnit === QUANTITY_UNIT ? _t('global.unit') : formatCurrency(baseCurrency);
}

export function ContractUnitQuantity({ tradingUnit, value = 0, contract, fixed, round }) {
  // 当service不可用的时候 value为null 会导致页面崩溃
  let unit = isFinite(Number(value)) ? Number(value) : 0;
  let precision = 0;
  const { multiplier, isInverse } = contract || {};
  if (!isInverse && tradingUnit !== QUANTITY_UNIT) {
    precision = getDigit(multiplier, true);
    unit = multiplyFloor(value, multiplier, precision);
  }
  if (fixed !== undefined) {
    precision = fixed;
  }
  return <AmountPrecision value={unit} pointed dropZ={false} fixed={precision} round={round} />;
}
