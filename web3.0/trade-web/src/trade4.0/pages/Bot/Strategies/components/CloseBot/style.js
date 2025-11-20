/**
 * Owner: mikeu@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui/emotion';
import Spin from '@mui/Spin';

export const FontSizeBox = styled.div`
  .gray-text-color {
    color: ${({ theme }) => theme.colors.text};
  }
  .coin-text {
    color: ${({ theme }) => theme.colors.primary};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    .sm-title {
      font-size: 16px;
      margin-bottom: 12px;
    }
    .sm-desc {
      font-size: 14px;
      margin-bottom: 24px;
    }
  }
`;


export const MSpin = styled(Spin)`
.KuxSpin-container {
  &:after {
    background: transparent
  }
}

`;
