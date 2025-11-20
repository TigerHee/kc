/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { formatNumber, getDigit } from '@/pages/Futures/import';
import { useFuturesSymbols } from 'src/trade4.0/hooks/common/useSymbol';

const AvgEntryPriceCell = ({ avgEntryPrice, symbol: poSymbol }) => {
  const contracts = useFuturesSymbols();
  const tickSize = _.get(contracts, `${poSymbol}.tickSize`);

  const digit = getDigit(tickSize);
  return (
    <span>
      {formatNumber(avgEntryPrice, {
        fixed: digit,
        dropZ: false,
        pointed: true,
      })}
    </span>
  );
};

export default React.memo(AvgEntryPriceCell);
