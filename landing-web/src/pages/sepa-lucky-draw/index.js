/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { ThemeProvider } from '@kufox/mui';
import Notice from 'components/$/MarketCommon/Notice';
import Rules from 'src/components/$/luckydrawSepa/Rules';
import Banner from 'src/components/$/luckydrawSepa/Banner';
import ActivityPeriod from 'src/components/$/luckydrawSepa/ActivityPeriod';
import PrizePool from 'src/components/$/luckydrawSepa/PrizePool';
import ParticipateStep from 'src/components/$/luckydrawSepa/ParticipateStep';
import Bonus from 'components/$/MarketCommon/Bonus';
import Footer from 'components/$/MarketCommon/Footer';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';

const namespace = 'luckydrawSepa';

const luckydrawSepa = () => {
  return (
    <ThemeProvider>
      <Notice namespace={namespace} />
      <Banner />
      <ActivityPeriod />
      <PrizePool />
      <ParticipateStep />
      <Rules />
      <Bonus namespace={namespace} />
      <Footer namespace={namespace} />
    </ThemeProvider>
  );
};

export default brandCheckHoc(luckydrawSepa, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
