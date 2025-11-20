import React from 'react';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';

import EllipsisText from 'components/Common/EllipsisText';
import useLang from 'hooks/useLang';
import {
  PnlInfoWrap,
  PnlLabel,
  PnlRowWrap,
  PnlValueRowWrap,
  RowWrap,
  TotalMinPnlPercent,
  TotalPnlValue,
} from '../styles';

const PositionPnlInfo = props => {
  const {pnl, pnlRatio} = props;
  const {_t} = useLang();
  return (
    <PnlInfoWrap>
      <PnlRowWrap>
        <RowWrap>
          <PnlLabel>
            {_t('25279aedb3084000aea4', {symbol: getBaseCurrency()})}
          </PnlLabel>
        </RowWrap>
      </PnlRowWrap>

      <PnlValueRowWrap>
        <RowWrap
          style={css`
            flex-wrap: wrap;
            align-items: flex-end;
          `}>
          <EllipsisText>
            <TotalPnlValue isProfitNumber>{pnl}</TotalPnlValue>

            <TotalMinPnlPercent beforeText="(" afterText=")">
              {pnlRatio}
            </TotalMinPnlPercent>
          </EllipsisText>
        </RowWrap>
      </PnlValueRowWrap>
    </PnlInfoWrap>
  );
};

export default PositionPnlInfo;
