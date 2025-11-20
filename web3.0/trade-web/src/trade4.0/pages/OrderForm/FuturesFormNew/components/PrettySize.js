/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import clsx from 'clsx';

import { get, isNaN } from 'lodash';

import {
  _t,
  formatCurrency,
  formatNumber,
  QUANTITY_UNIT,
  getDigit,
  multiply,
} from '../builtinCommon';

import { useGetSymbolInfo, useGetUnit } from '../hooks/useGetData';

// 此组件仅用作数量显示

const PrettySize = ({ value = 0, unit = true, fix = false, formatProps = {}, className = '' }) => {
  const { tradingUnit } = useGetUnit();
  const { symbolInfo: contract } = useGetSymbolInfo();

  if (!contract || isNaN(+value)) {
    return '--';
  }

  const formatValue = formatNumber(value, {
    pointed: true,
    dropZ: false,
    fixed: 0,
    ...formatProps,
  });

  const isQuantity = contract.isInverse || tradingUnit === QUANTITY_UNIT;

  // 反向合约或者币对数量只有张的显示
  if (isQuantity) {
    return unit ? (
      <span className={className}>
        <span className="noRtl">{formatValue}</span>
        <span>{` ${_t('global.unit')}`}</span>
      </span>
    ) : (
      formatValue
    );
  }

  const multiplierSize = get(contract, 'multiplier', 0);
  const size = multiply(value)(multiplierSize);

  if (!fix) {
    const formatSize = formatNumber(size, { pointed: true, dropZ: false, ...formatProps });
    return (
      <span className={clsx('noRtl', className)}>
        {unit ? `${formatSize} ${formatCurrency(contract.baseCurrency)}` : formatSize}
      </span>
    );
  }

  const formatUnitSize = formatNumber(size, {
    pointed: true,
    fixed: getDigit(multiplierSize, true),
    dropZ: false,
    ...formatProps,
  });
  return (
    <span className={clsx('noRtl', className)}>
      {unit ? `${formatUnitSize} ${formatCurrency(contract.baseCurrency)}` : formatUnitSize}
    </span>
  );
};

export default React.memo(PrettySize);
