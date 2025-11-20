/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { push } from 'components/Router';
import { tenantConfig } from 'src/config/tenant';
import brandCheckHoc from 'src/hocs/brandCheckHoc';

export default brandCheckHoc(() => {
  useEffect(() => {
    push('/kucoinlabs');
  }, []);

  return (
    <div />
  )
}, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute))
