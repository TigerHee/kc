/**
 * Owner: june.lee@kupotech.com
 */

import { styled } from '@kux/mui';

export const SubAccountCommonWrapper = styled.div`
  padding: 0 64px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding: 0 32px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;
