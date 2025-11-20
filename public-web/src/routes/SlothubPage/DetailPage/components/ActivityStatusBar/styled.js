/*
 * @Date: 2024-05-27 18:33:02
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import styled from '@emotion/styled';
import TimeCountDown from 'src/routes/SlothubPage/components/TimeCountDown';

export const ColumnWrap = styled.section`
  display: flex;
  flex-direction: column;
`;

export const Card = styled(ColumnWrap)`
  background: #fff;
  border-radius: 16px;
  width: 407px;
  position: relative;
  z-index: 1;
  justify-content: space-between;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04), 0px 0px 1px 0px rgba(0, 0, 0, 0.04);

  ${({ theme }) => theme.breakpoints.down('lg')} {
    width: 100%;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: calc(100% - 32px);
    margin: 0 auto;
    box-shadow: unset;
  }
`;

export const ContentWrap = styled.section`
  display: flex;
  justify-content: space-between;
  padding: 24px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 14px;
  }
`;

export const BottomWrap = styled.div`
  border-radius: 0px 0px 16px 16px;
  background: rgba(211, 244, 117, 0.24);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 49px;
  padding: 0 24px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text40};
  font-weight: 400;
  line-height: 130%;

  .center {
    width: 100%;
    text-align: center;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 34px;
    padding: 0 14px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 500;
    font-size: 12px;
  }
`;

export const Text = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 20px;
  }

  &.highlight {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SecondaryText = styled.span`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
  margin-top: 8px;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 4px;
    font-size: 13px;
  }
`;

export const PrimaryColorText = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
`;

export const StyledTimeCountDown = styled(TimeCountDown)`
  .tag-item {
    padding: 2px;
    font-size: ${({ isH5 }) => (isH5 ? '14px' : '16px')};
    background: #121212;
    border: 0.5px solid rgba(211, 244, 117, 0.12);
    border-radius: 2px;
    backdrop-filter: blur(2px);
  }
`;
