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
import CommunityLink from 'components/$/LuckydrawTurkey/CommunityLink';
import Bonus from 'components/$/MarketCommon/Bonus';
import Footer from 'components/$/MarketCommon/Footer';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';

const namespace = 'newTurkey';

const Turkishluckydraw = () => {
  return (
    <ThemeProvider>
      <Notice />
      <Banner namespace={namespace} />
      <ActivityPeriod namespace={namespace} />
      <ParticipateStep namespace={namespace} />
      <ParticipationTutorial namespace={namespace} />
      <TermsConditions namespace={namespace} />
      <CommunityLink namespace={namespace} />
      <Bonus namespace={namespace} />
      <Footer namespace={namespace} />
    </ThemeProvider>
  );
};

export default brandCheckHoc(Turkishluckydraw, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
