/**
 * Owner: clyne@kupotech.com
 */

import React, { memo } from 'react';
import { styled, fx, useMarkPrice } from '@/pages/Futures/import';
import FormatPriceCell from '@/pages/Orders/FuturesOrders/components/FormatPriceCell';

const PriceCellWrapper = styled.div`
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
`;

const PriceCell = ({ symbol, avgEntryPrice, markPrice }) => {
  const markPriceData = useMarkPrice(symbol);

  return (
    <PriceCellWrapper className="text-color">
      <span>
        <FormatPriceCell value={avgEntryPrice} symbol={symbol} type="TP" />
      </span>
      <br />
      <span>
        <FormatPriceCell value={markPriceData || markPrice} symbol={symbol} type="MP" />
      </span>
    </PriceCellWrapper>
  );
};

export default memo(PriceCell);
