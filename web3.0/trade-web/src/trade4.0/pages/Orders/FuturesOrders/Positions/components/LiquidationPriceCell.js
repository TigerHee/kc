/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo } from 'react';
import { _t } from 'utils/lang';
import { styled, fx } from '@/style/emotion';
import FormatPriceCell from '../../components/FormatPriceCell';

const LiquidationPriceCellWrapper = styled.div`
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
  ${(props) => fx.color(props, 'complementary')}
`;

const LiquidationPriceCell = ({ symbol, liquidationPrice }) => {
  return (
    <LiquidationPriceCellWrapper>
      <FormatPriceCell value={liquidationPrice} type="MP" symbol={symbol} />
    </LiquidationPriceCellWrapper>
  );
};

export default memo(LiquidationPriceCell);
