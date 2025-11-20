/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo } from 'react';
import { _t } from 'utils/lang';
import { styled, fx } from '@/style/emotion';
import { useMarkPrice } from 'src/trade4.0/hooks/futures/useMarket';

import FormatPriceCell from '../../components/FormatPriceCell';

const PriceCellWrapper = styled.div`
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
`;

const PriceCell = ({ symbol, avgEntryPrice, markPrice }) => {
  const markPriceData = useMarkPrice(symbol);

  return (
    <PriceCellWrapper>
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
