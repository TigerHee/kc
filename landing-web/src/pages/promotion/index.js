/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { ThemeProvider } from '@kufox/mui';
import loadable from '@loadable/component';
import Footer from 'components/$/MarketCommon/Footer';
import SwitchTab from 'components/$/Consensus/SwitchTab';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
// import WithLine from 'components/$/Consenspus/WithLine';
import Banner from 'components/$/Consensus/Banner';

const Bonus = loadable(() => import('components/$/MarketCommon/Bonus'));
const namespace = 'promotion';

const Promotion = () => {
  return (
    <ThemeProvider>
      {/* <WithLine> */}
      <Banner />
      <SwitchTab />
      {/* </WithLine> */}
      <Bonus namespace={namespace} />
      <Footer namespace={namespace} />
    </ThemeProvider>
  );
};

export default brandCheckHoc(Promotion, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
