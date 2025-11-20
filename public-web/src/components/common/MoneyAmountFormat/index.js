/**
 * Owner: willen@kupotech.com
 */
import React from 'react';

import { useSelector } from 'src/hooks/useSelector';
import useMarketCap from './hooks/useMarketCap';

const MoneyAmountFormat = ({
  value,
  showChar = true,
  showLegalCurrency = false,
  needTransfer = true,
  needGapChar = true,
}) => {
  const { currency } = useSelector((state) => state.currency);
  const markcap = useMarketCap({ needTransfer, value, showChar });
  const showMarkCap = markcap || '--';
  return (
    <React.Fragment>
      {value ? showMarkCap : '--'}
      {(needGapChar || showLegalCurrency) && '&nbsp;'}
      {showLegalCurrency ? currency : ''}
    </React.Fragment>
  );
};

export default MoneyAmountFormat;
