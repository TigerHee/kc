/*
 * @Date: 2024-06-13 19:54:07
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-18 01:51:25
 */
/**
 * Owner: odan.ou@kupotech.com
 */

import { _t } from 'utils/lang';
import { styled } from '@/style/emotion';
import { eTheme } from '@/utils/theme';

export const CoinInfoWrap = styled.div`
  width: 400px;
  max-width: 100%;
  max-height: 100%;
  border-radius: 4px;
  padding: 24px;
  overflow: auto;
  font-size: 14px;
  line-height: 1.3;
  /* background: ${eTheme('overlay')}; */
  text-align: justify;
  color: ${eTheme('text60')};
  ${(props) => props.theme.breakpoints.up('lg')} {
    max-height: calc(100vh - 190px);
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    max-height: calc(100vh - 240px);
  }
  > div:not(:last-of-type) {
    margin-bottom: 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;

export const CoinTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${eTheme('text')};
`;

export const CoinSubTitle = styled.span`
  font-weight: 400;
  padding-left: 4px;
  color: ${eTheme('text40')};
`;

export const MaringTop12 = styled.div`
  margin-top: 12px;
`;

export const CoinInfoMore = styled.div`
  text-align: center;
`;

export const BriefIntroText = styled.div`
  max-height: 162px;
  overflow: auto;
  margin-top: 12px;
  text-align: justify;
  > :first-of-type {
    margin-top: 0px;
    padding-top: 0;
  }
  > :last-of-type {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  color: ${eTheme('text40')};
  background-color: inherit;
  span {
    color: inherit !important;
    background-color: inherit !important;
  }
`;

export const DisclaimerCard = styled.div`
  display: flex;
  margin: 20px 0;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.complementary8};

  .text {
    color: ${({ theme }) => theme.colors.text60};
    font-size: 14px;
    font-weight: 400;
    line-height: 150%;
  }
`;
