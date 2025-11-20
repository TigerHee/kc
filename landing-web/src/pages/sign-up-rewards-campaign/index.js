/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { ThemeProvider } from '@kufox/mui';
import Notice from 'components/$/MarketCommon/Notice';
import Banner from 'components/$/LuckydrawTurkey/Banner';
import ActivityPeriod from 'components/$/LuckydrawTurkey/ActivityPeriod';
import ParticipateStep from 'components/$/LuckydrawTurkey/ParticipateStep';
import ParticipationTutorial from 'components/$/LuckydrawTurkey/ParticipationTutorial';
import TermsConditions from 'components/$/LuckydrawTurkey/TermsConditions';
import Bonus from 'components/$/MarketCommon/Bonus';
import Footer from 'components/$/MarketCommon/Footer';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';

const Turkishluckydraw = () => {
  return (
    <ThemeProvider>
      <Notice />
      <Banner />
      <ActivityPeriod />
      <ParticipateStep />
      <ParticipationTutorial />
      <TermsConditions />
      <Bonus />
      <Footer />
    </ThemeProvider>
  );
};

export default brandCheckHoc(Turkishluckydraw, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
