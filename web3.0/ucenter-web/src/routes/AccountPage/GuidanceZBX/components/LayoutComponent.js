/**
 * Owner: john.zhang@kupotech.com
 */

import { Button, styled } from '@kux/mui';
import LottieThemeIcon from 'src/components/LottieThemeIcon';

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.overlay};
  min-height: calc(100vh - 72px);

  max-width: 640px;
  margin: 0 auto;
  padding: 28px 0 20px 0;
  span {
    line-height: 140%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px;
  }
`;

export const Wrapper = styled.section`
  position: relative;
  margin: 56px auto 0;
  max-width: 580px;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin: 24px 16px 0;
    margin-top: ${({ isApp }) => (isApp ? '84px' : '24px')};
  }
`;

export const SubTitle = styled.p`
  margin-bottom: 16px;
  font-size: 16px;
  text-align: center;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text60};
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

export const StatusIcon = styled.img`
  width: 160px;
  height: 160px;
  margin-bottom: 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 136px;
    height: 136px;
  }
`;

export const CustomButton = styled(Button)`
  width: 100%;
  padding: 24px 28px;
  font-size: 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 16px 24px;
    font-size: 14px;
  }
`;

export const LottieIcon = styled(LottieThemeIcon)`
  width: 160px;
  height: 160px;
  margin-bottom: 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 136px;
    height: 136px;
  }
`;
