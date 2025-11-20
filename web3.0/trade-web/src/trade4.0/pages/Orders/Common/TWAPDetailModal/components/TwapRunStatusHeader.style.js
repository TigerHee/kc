/**
 * Owner: harry.lai@kupotech.com
 */
import styled from '@emotion/styled';
import { LazyImage } from '@/components/LazyBackground';

export const Wrap = styled.div`
  padding: 24px 0 8px;
`;

export const PauseLabel = styled.span`
  padding: 2px 6px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.complementary12};
  color: ${({ theme }) => theme.colors.complementary};
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  margin-left: 8px;
`;

export const TimeTextWrap = styled.section`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

export const TimeText = styled.span`
  padding-left: 4px;
  color: ${({ theme, isPaused, isDisabled }) => {
    if (isDisabled) {
      return theme.colors.icon;
    }
    return isPaused ? theme.colors.complementary : theme.colors.primary;
  }};
  font-family: Roboto;
  font-size: 14px;
  font-weight: 400;
  line-height: 130%; /* 18.2px */
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

export const SymbolTextWrap = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-family: Roboto;
  font-weight: 700;
  line-height: 130%;
  padding-left: 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

export const SymbolIcon = styled(LazyImage)`
  width: 24px;
  height: 24px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 20px;
    height: 20px;
  }
`;
