/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import WorldCup from 'src/components/$/CryptoCup';

export default brandCheckHoc(() => {
  return <WorldCup />;
}, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
