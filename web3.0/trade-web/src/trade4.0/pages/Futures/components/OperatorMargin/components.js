/**
 * Owner: garuda@kupotech.com
 * value 值 Box
 */
import React, { memo } from 'react';

import { formatNumber } from '@/utils/futures';

import { ResultItemValue } from './commonStyle';

export const ResultValue = memo(({ value, children, type, fixed }) => {
  const endUnit = type === 'lev' ? 'x' : '';
  return (
    <ResultItemValue className="result-value" value={value}>
      {value == null || value === ''
        ? '--'
        : children || `${formatNumber(value, { fixed, dropZ: false })}${endUnit}`}
    </ResultItemValue>
  );
});
