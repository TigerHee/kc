/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import ReferFriends from 'src/components/$/ReferFriends';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';

function Page() {
  return <ReferFriends />;
};

export default brandCheckHoc(Page, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute))
