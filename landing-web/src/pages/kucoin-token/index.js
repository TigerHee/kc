/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import KCS from 'components/$/KucoinToken';

// 以前kcs生态组做的
const KucoinToken = () => {
  return <KCS />;
};

export default brandCheckHoc(KucoinToken, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
