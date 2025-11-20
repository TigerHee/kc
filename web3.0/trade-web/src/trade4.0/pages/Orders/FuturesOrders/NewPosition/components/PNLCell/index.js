/**
 * Owner: clyne@kupotech.com
 */

import React, { memo } from 'react';
import { PrettyCurrency, styled, fx } from '@/pages/Futures/import';
import { greaterThan } from 'utils/operation';

const RNLCellWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  white-space: normal;
  /* word-break: break-all; */
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
  ${(props) => fx.color(props, props.color === 'primary' ? 'primary' : 'secondary')}
  >span {
    margin-right: 2px;
  }
`;

const ContentWrapper = styled.div`
  ${(props) => fx.color(props, props.color === 'primary' ? 'primary' : 'secondary')}
`;

const UnRNLCell = ({ row = {} }) => {
  const { settleCurrency, realisedPnl } = row || {};
  const colorPnl = greaterThan(realisedPnl)(0) ? 'primary' : 'secondary';

  return (
    <RNLCellWrapper color={colorPnl} className="sm-item">
      <ContentWrapper color={colorPnl}>
        <PrettyCurrency isShort value={realisedPnl} currency={settleCurrency} />
      </ContentWrapper>
    </RNLCellWrapper>
  );
};

export default memo(UnRNLCell);
