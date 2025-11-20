/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import AboutUs from '@/routes/AboutUsPage';
import AboutUsNew from '@/routes/AboutUsPageNew';
import { tenantConfig } from 'config/tenant';
import AboutUsTH from '@/routes/AboutUsPageNew/AboutUsTH';

export default () => {
  if (tenantConfig.aboutUs.showNewPage) {
    return <AboutUsNew />;
  }
  if (tenantConfig.aboutUs.showTHPage) {
    return <AboutUsTH />;
  }
  return <AboutUs />;
};
