/**
 * Owner: john.zhang@kupotech.com
 */

import { Button, styled } from '@kux/mui';

export const PageWrapper = styled.article`
  padding: 0px 120px 64px;
  margin: 0 auto;
  max-width: 1440px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding: 0px 24px 64px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0px 16px 64px;
  }
`;

export const Content = styled.section`
  margin: 0px 0 44px;
  padding-top: 44px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  position: relative;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 16px;
    margin: 0px 0 32px;
    padding-top: 40px;
  }
`;

export const PageFooterWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`;

export const OperationBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  width: 100%;
`;

export const BackBtn = styled(Button)`
  padding: 9px 12px;
  justify-content: center;
  align-items: center;
`;

export const ContinueBtn = styled(Button)`
  min-width: 216px;
  padding: 24px 32px;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
`;
