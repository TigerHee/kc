/*
  * owner: borden@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import TooltipOver from '@/components/TooltipOver';
import CoinCodeToName from '@/components/CoinCodeToName';

const StyledTooltipOver = styled(TooltipOver)`
  color: ${props => props.theme.colors.text40};
`;

const Unit = React.memo(({ coin, coinName }) => {
  return (
    <StyledTooltipOver maxWidth={64}>
      {coinName || <CoinCodeToName coin={coin} />}
    </StyledTooltipOver>
  );
});

export default Unit;
