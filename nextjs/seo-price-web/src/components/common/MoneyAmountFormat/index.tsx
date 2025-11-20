/**
 * Owner: will.wang@kupotech.com
 */
import useMarketCap from '@/hooks/useMarketCap';
import { useCurrencyStore } from '@/store/currency';
import React from 'react';

const MoneyAmountFormat = ({
  value,
  showChar = true,
  showLegalCurrency = false,
  needTransfer = true,
}) => {
  const currency = useCurrencyStore((state) => state.currency);
  const markcap = useMarketCap({ needTransfer, value, showChar });
  return (
    <React.Fragment>
      <span>{value ? `${markcap} ` : '-- '}</span>
      <span>{showLegalCurrency ? currency : ''}</span>
    </React.Fragment>
  );
};

export default MoneyAmountFormat;
