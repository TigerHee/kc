/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { ThemeProvider } from '@kufox/mui';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import Notice from 'components/$/MarketCommon/Notice';
import Bonus from 'components/$/MarketCommon/Bonus';
import Footer from 'components/$/MarketCommon/Footer';

import Banner from 'components/$/PakistanCampaign/Banner';
import ActivityPeriod from 'components/$/PakistanCampaign/ActivityPeriod';
import PrizePool from 'components/$/PakistanCampaign/PrizePool';
import Rules from 'components/$/PakistanCampaign/Rules';

const namespace = 'pakistanCampaign';

const PakistanCampaignPage = () => {
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

export default brandCheckHoc(PakistanCampaignPage, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
