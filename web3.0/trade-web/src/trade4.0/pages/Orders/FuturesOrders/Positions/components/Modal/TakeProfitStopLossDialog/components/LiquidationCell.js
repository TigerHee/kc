/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import Text from '@/components/Text';
import FormatPriceCell from '../../../../../components/FormatPriceCell';

const LiquidationCell = ({ symbol, liquidationPrice }) => {
  return (
    <Text short>
      <FormatPriceCell value={liquidationPrice} symbol={symbol} type="MP" />
    </Text>
  );
};

export default React.memo(LiquidationCell);
