/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { ThemeProvider } from '@kufox/mui';
import { px2rem } from '@kufox/mui/utils';
import { useSelector } from 'dva';
import bgImg from 'assets/antiPhishing/bg.png';
import Header from 'components/$/AntiPhishing/Header';
import IsWhat from 'components/$/AntiPhishing/IsWhat';
import CommonAttacks from 'components/$/AntiPhishing/CommonAttacks';
import HowProtect from 'components/$/AntiPhishing/HowProtect';
import Tips from 'components/$/AntiPhishing/Tips';
import ReadMore from 'components/$/AntiPhishing/ReadMore';

const PageWrapper = styled.div`
  max-width: ${px2rem(750)};
  margin: 0 auto;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.base};
  overflow: auto;
`;

const Background = styled.img`
  width: 100%;
  min-height: ${px2rem(372)};
`;

const PageInner = styled.div`
  padding: 0 ${px2rem(16)} ${px2rem(24)};
`;

const AntiPhishing = () => {
  const { isInApp } = useSelector(state => state.app);

  return (
    <ThemeProvider>
      <PageWrapper id="antiPhishingWrapper" data-inspector="antiPhishingPage">
        <Background src={bgImg} />
        <PageInner>
          <Header isInApp={isInApp} />
          <IsWhat isInApp={isInApp} />
          <CommonAttacks />
          <HowProtect isInApp={isInApp} />
          <Tips />
          <ReadMore isInApp={isInApp} />
        </PageInner>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default AntiPhishing;
