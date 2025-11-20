/**
 * Owner: garuda@kupotech.com
 * format 价格精度
 */
import React, { memo, useMemo } from 'react';

import { FUTURES } from '@/meta/const';

import { toNonExponential } from '@/utils/format';
import { formatNumber } from '@/utils/futures';

import { useGetSymbolInfo } from '@/hooks/common/useSymbol';

const FormatPriceCell = ({ value, symbol, type = 'TP', prefix = '', className }) => {
  const { pricePrecision, indexPricePrecision, basePrecision } = useGetSymbolInfo({
    symbol,
    tradeType: FUTURES,
  });

  const priceFixed = useMemo(() => {
    if (type === 'TP') {
      return pricePrecision;
    } else if (type === 'BASE') {
      return basePrecision;
    }
    return indexPricePrecision;
  }, [type, indexPricePrecision, pricePrecision, basePrecision]);
  const isEmpty = value === '' || value === undefined || value === null;
  if (isEmpty || !symbol || value === '-' || value === '--') {
    return '--';
  }
  const ret = `${prefix}${formatNumber(toNonExponential(value), { fixed: priceFixed, dropZ: false })}`;

  if (className) {
    return <div className={className}>{ret}</div>;
  }
  return <>{ret}</>;
};

export default memo(FormatPriceCell);
