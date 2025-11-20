/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import { useLocale } from '@kucoin-base/i18n';
// import 'animate.css';
// import { WOW } from 'wowjs';
import { addLangToPath } from 'src/tools/i18n';
import siteConfig from 'utils/siteConfig';

const NewBieZone = () => {
  useLocale();
  // useEffect(() => {
  //   new WOW({ offset: 10 }).init();
  // }, []);
  const { LANDING_HOST } = siteConfig;
  //  新手专区页面下线，重定向到福利中心页面
  useEffect(() => {
    window.location.href = addLangToPath(`${LANDING_HOST}/KuRewards`);
  }, [LANDING_HOST]);

  return <div data-inspector="zone_page" />;
};

export default NewBieZone;
