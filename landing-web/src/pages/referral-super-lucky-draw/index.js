/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { ThemeProvider } from '@kufox/mui';
import Notice from 'components/$/MarketCommon/Notice';
import Banner from 'components/$/Luckydraw/Banner';
import Participate from 'components/$/Luckydraw/Participate';
import ActivityPeriod from 'components/$/Luckydraw/ActivityPeriod';
import PrizePool from 'components/$/Luckydraw/PrizePool';
import Draw from 'components/$/Luckydraw/Draw';
import Rules from 'components/$/Luckydraw/Rules';
import Bonus from 'components/$/MarketCommon/Bonus';
import Footer from 'components/$/MarketCommon/Footer';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';

const namespace = 'luckydraw';

const Turkishluckydraw = () => {
  return (
    <ThemeProvider>
      <Notice namespace={namespace} />
      <Banner namespace={namespace} />
      <ActivityPeriod />
      <PrizePool />
      <Participate namespace={namespace} />
      <Draw namespace={namespace} />
      <Rules namespace={namespace} />
      <Bonus namespace={namespace} />
      <Footer namespace={namespace} />
    </ThemeProvider>
  );
};

export default brandCheckHoc(Turkishluckydraw, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
