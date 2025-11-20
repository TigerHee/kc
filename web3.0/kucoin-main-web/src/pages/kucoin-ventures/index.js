/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import { useLocale } from '@kucoin-base/i18n';
import Pages from '@/routes/KucoinVentures';
import NewPage from '@/routes/KucoinVenturesNew';
import { WOW } from 'wowjs';
import { tenantConfig } from 'config/tenant';

const wow = new WOW({ offset: 10, live: false });

export default () => {
  useLocale();
  useEffect(() => {
    wow.init();
  }, []);

  if (tenantConfig.showNewVenturesPage) {
    return <NewPage />;
  }

  return <Pages />;
};
