/**
 * Owner: clyne@kupotech.com
 */
// 此组件仅用作数量和价格计算价值
import React from 'react';
import Decimal from 'decimal.js';
import { FUTURES } from '@/meta/const';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import PrettyCurrency from '@/components/PrettyCurrency';

export default ({ symbol, size, price, ...props }) => {
  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });

  if (!contract || !contract.symbol) {
    return '';
  }

  const { isInverse, multiplier, settleCurrency } = contract;

  let value = new Decimal(size).mul(price).mul(multiplier);

  if (isInverse) {
    value = new Decimal(size).div(price);
  }

  return <PrettyCurrency {...props} currency={settleCurrency} value={value.toFixed()} />;
};
