import { styled } from '@kux/mui';

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;
export const AlertWrapper = styled.div`
  width: 100%;
  .KuxAlert-root {
    border-radius: 0;
  }
  .KuxAlert-title {
    display: flex;
    gap: 16px;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
  }
  .KuxAlert-icon {
    margin-top: 4px;
  }
`;
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 580px;
  max-width: 580px;
  margin-top: ${({ hasBack }) => (hasBack ? 26 : 56)}px;
  margin-bottom: 80px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: ${({ isPI }) => (isPI ? 32 : 40)}px;
    width: 100%;
    max-width: initial;
    margin-top: ${({ hasBack }) => (hasBack ? 16 : 40)}px;
    margin-bottom: 0;
  }
`;
