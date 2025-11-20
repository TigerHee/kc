/*
 * @Date: 2024-05-27 18:33:02
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import styled from '@emotion/styled';
import CoinIcon from 'src/components/common/CoinIcon';

export const StyledProjectInfo = styled.div`
  background: ${({ theme }) => theme.colors.backgroundMajor};
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 28px;
  font-weight: 700;
  line-height: 130%;
  margin-bottom: 24px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
    font-size: 18px;
  }
`;

export const StyledSection = styled.div`
  margin-bottom: 32px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 24px;
  }
`;

export const StyledInfoSection = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    flex-direction: row;
  }
`;

export const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  &:last-of-type {
    margin-bottom: 0;
  }
  ${({ theme }) => theme.breakpoints.up('sm')} {
    flex-direction: column-reverse;

    width: 230px;
    margin-right: 12px;
    margin-bottom: 0;
  }
`;

export const StyledLabel = styled.div`
  display: flex;
  align-items: center;

  .text {
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 16px;
    line-height: 130%;

    ${({ theme }) => theme.breakpoints.down('sm')} {
      font-weight: 500;
      font-size: 14px;
    }
  }

  .icon {
    width: 16px;
    height: 16px;
    margin-right: 6px;

    ${({ theme }) => theme.breakpoints.up('sm')} {
      width: 18px;
      height: 18px;
    }

    ${({ theme }) => theme.breakpoints.up('lg')} {
      display: none;
    }
  }
`;

export const StyledValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-bottom: 6px;
    font-weight: 700;
    font-size: 20px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

export const StyledTagWrap = styled.div`
  display: flex;
  overflow-x: scroll;
  width: 100%;
  white-space: nowrap;
  overflow-y: hidden;
  margin-top: 16px;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 8px;
  }

  -ms-overflow-style: none; /* IE 11 */
  scrollbar-width: none; /* Firefox */
`;

export const StyledTagItem = styled.span`
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.cover4};
  color: ${({ theme }) => theme.colors.text40};
  margin-right: 8px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  padding: 2px 6px;
`;

export const CoinTitleWrap = styled.section`
  display: flex;
  align-items: center;

  .coin-name {
    margin: 0 12px;
    color: #1d1d1d;
    font-weight: 700;
    font-size: 24px;
    line-height: 130%;

    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin: 0 8px;
      font-weight: 600;
      font-size: 16px;
    }
  }
  .label {
    color: #1d1d1d;
    font-weight: 400;
    font-size: 16px;
    line-height: 130%;

    ${({ theme }) => theme.breakpoints.down('sm')} {
      font-weight: 400;
      font-size: 14px;
    }
  }
`;

export const StyledCoinIcon = styled(CoinIcon)`
  width: 32px;
  height: 32px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 22px;
    height: 22px;
  }
`;
