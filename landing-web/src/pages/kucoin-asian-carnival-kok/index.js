/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { ThemeProvider } from '@kufox/mui';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import Notice from 'components/$/MarketCommon/Notice';
import Banner from 'components/$/AsianCarnival/Banner';
import ActivityPeriod from 'components/$/AsianCarnival/ActivityPeriod';
import PrizePool from 'components/$/AsianCarnival/PrizePool';
import Rules from 'components/$/AsianCarnival/Rules';
import Bonus from 'components/$/MarketCommon/Bonus';
import Footer from 'components/$/MarketCommon/Footer';

const namespace = 'asianCarnival';

const Turkishluckydraw = () => {
  return (
    <ThemeProvider>
      <Notice namespace={namespace} />
      <Banner />
      <ActivityPeriod />
      <PrizePool />
      <Rules />
      <Bonus namespace={namespace} />
      <Footer namespace={namespace} />
    </ThemeProvider>
  );
};

export default brandCheckHoc(Turkishluckydraw, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
