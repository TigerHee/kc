/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import AntiPhishing from 'components/$/AntiPhishing';
import { tenantConfig } from 'src/config/tenant';

export default brandCheckHoc(() => {
  return <AntiPhishing />;
}, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
