/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import { WOW } from 'wowjs';
import { useDispatch } from 'react-redux';
import { tenantConfig } from 'config/tenant';
import Banner1 from 'components/AboutUs/Banner1';
import Banner2 from 'components/AboutUs/Banner2';
import Banner3 from 'components/AboutUs/Banner3';
import Banner4 from 'components/AboutUs/Banner4';
import Banner5 from 'components/AboutUs/Banner5';
import Banner6 from 'components/AboutUs/Banner6';

const AboutUs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    new WOW({ offset: 10 }).init();

    // 获取用户数量，交易币种数量配置
    if (tenantConfig.aboutUs.useDynamicData) {
      dispatch({ type: 'newhomepage/pullPageConfigItems' });
    }
  }, []);

  return (
    <>
      <Banner1 />
      <Banner2 />
      <Banner3 />
      <Banner4 />
      <Banner5 />
      <Banner6 />
    </>
  );
};

export default AboutUs;
