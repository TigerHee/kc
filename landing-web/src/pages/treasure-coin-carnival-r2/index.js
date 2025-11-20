/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { ThemeProvider } from '@kufox/mui';
import Notice from 'components/$/MarketCommon/Notice';
import Footer from 'components/$/MarketCommon/Footer';
import Bonus from 'components/$/MarketCommon/Bonus';
import CommonDialog from 'components/$/MarketCommon/CommonDialog';
import Banner from 'components/$/NewCoin/Banner';
import ActivityPeriod from 'components/$/NewCoin/ActivityPeriod';
import AwardAndStep from 'components/$/NewCoin/AwardAndStep';
import LuckyGuy from 'components/$/NewCoin/LuckyGuy';
import Rules from 'components/$/NewCoin/Rules';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';

const namespace = 'newCoinCarnival';

const Turkishluckydraw = () => {
  return (
    <div data-inspector="treasureCoinCarnivalR2Page">
      <ThemeProvider>
        <Notice namespace={namespace} />
        <Banner round="two" />
        <ActivityPeriod />
        <AwardAndStep round="two" />
        <LuckyGuy />
        <Rules />
        <Bonus namespace={namespace} />
        <Footer namespace={namespace} />
        <CommonDialog namespace={namespace} />
      </ThemeProvider>
    </div>
  );
};

export default brandCheckHoc(Turkishluckydraw, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
