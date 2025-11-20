/**
 * Owner: clyne@kupotech.com
 */

import React, { memo } from 'react';
import { styled, fx, useGetPositionCalcData } from '@/pages/Futures/import';
import FormatPriceCell from '@/pages/Orders/FuturesOrders/components/FormatPriceCell';
import {
  POS_LIQUID_PRICE,
  useShowFallback,
} from '@/pages/Orders/FuturesOrders/hooks/useShowFallback';

const LiquidationPriceCellWrapper = styled.div`
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
  ${(props) => fx.color(props, 'complementary')}
`;

const LiquidationPriceCell = ({ row, style }) => {
  const { symbol, liquidationPrice: liquidPrice, marginMode, isTrialFunds } = row;
  const { liquidationPrice } = useGetPositionCalcData(symbol);

  const text = useShowFallback({
    marginMode,
    value: isTrialFunds ? liquidPrice : liquidationPrice || liquidPrice,
    type: POS_LIQUID_PRICE,
  });

  return (
    <LiquidationPriceCellWrapper style={style}>
      <FormatPriceCell value={text} type="MP" symbol={symbol} />
    </LiquidationPriceCellWrapper>
  );
};

export default memo(LiquidationPriceCell);
