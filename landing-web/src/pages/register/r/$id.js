/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';

const RegisterRcode = (props) => {
  const utm_source = queryPersistence.getPersistenceQuery('utm_source');
  const utm_campaign = queryPersistence.getPersistenceQuery('utm_campaign');
  const utm_medium = queryPersistence.getPersistenceQuery('utm_medium');

  useEffect(() => {
    const { match: { params: { id } } = {} } = props;
    const url_utm_source = utm_source ? `&utm_source=${utm_source}` : '';
    const url_utm_campaign = utm_campaign ? `&utm_campaign=${utm_campaign}` : '';
    const url_utm_medium = utm_medium ? `&utm_medium=${utm_medium}` : '';

    window.location.href = `/land/register?rcode=${id}${url_utm_source}${url_utm_campaign}${url_utm_medium}`;
  }, []);

  return <div />;
};

export default brandCheckHoc(RegisterRcode, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
