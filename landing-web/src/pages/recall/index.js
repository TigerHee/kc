/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import Recall from 'components/$/Recall';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';

export default brandCheckHoc(() => {
  return <Recall />;
}, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
