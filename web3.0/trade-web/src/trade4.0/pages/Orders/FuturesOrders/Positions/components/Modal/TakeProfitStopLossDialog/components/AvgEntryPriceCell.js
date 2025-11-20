/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import FormatPriceCell from '../../../../../components/FormatPriceCell';

const AvgEntryPriceCell = ({ avgEntryPrice, symbol }) => {
  return (
    <span>
      <FormatPriceCell value={avgEntryPrice} symbol={symbol} type="TP" />
    </span>
  );
};

export default React.memo(AvgEntryPriceCell);
