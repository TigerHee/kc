/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { WOW } from 'wowjs';
import { useDispatch } from 'react-redux';
import { tenantConfig } from 'config/tenant';
import { AboutusContainer, ContentWrapper } from './AboutUs.style';
import { useMount } from 'ahooks';
import KUCOIN from './components/Backgrounds/KUCOIN';
import Animated from './components/Backgrounds/Animated';
import { Header } from './components/Header';
import OurStoryBanner from './components/OurStoryBanner';
import OurAdvantedgesBanner from './components/OurAdvantedgesBanner';
import KucoinRoadmap from './components/KucoinRoadmap';
import JoinBanner from './components/JoinBanner';
import PrinciplesBanner from './components/PrinciplesBanner';
import { useTheme } from '@kux/mui';
import NoSSG from '@/components/NoSSG';

const AboutUs = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';

  useMount(() => {
    new WOW({ offset: 10 }).init();

    // 获取用户数量，交易币种数量配置
    if (tenantConfig.aboutUs.useDynamicData) {
      dispatch({ type: 'newhomepage/pullPageConfigItems' });
    }
  }, []);

  return (
    <AboutusContainer isDark={isDark}>
      <NoSSG>
        <Animated />
      </NoSSG>
      <KUCOIN isDark={isDark} />
      {/* 背景容器 */}
      <ContentWrapper>
        {/* 头部banner */}
        <Header />
        <OurStoryBanner />
        <OurAdvantedgesBanner />
        <KucoinRoadmap />
        <PrinciplesBanner />
        <JoinBanner />
      </ContentWrapper>
    </AboutusContainer>
  );
};

export default AboutUs;
