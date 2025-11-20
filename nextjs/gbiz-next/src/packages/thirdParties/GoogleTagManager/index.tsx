// TODO: Evaluate import 'client only'
import React from 'react';
import Script from 'next/script';
import { bootConfig } from 'kc-next/boot';
import { getGlobalTenantConfig, TTenantCode } from 'packages/tenant/config/globalTenantConfig';

export type GTMParams = {
  gtmScriptUrl?: string;
  dataLayerName?: string;
  nonce?: string;
};
export function GoogleTagManager(props: GTMParams) {
  const {
    gtmScriptUrl = 'https://www.googletagmanager.com/gtm.js',
    dataLayerName = 'dataLayer',
    nonce,
  } = props;
  const { gtmId } = getGlobalTenantConfig(bootConfig._BRAND_SITE_ as TTenantCode);

  return gtmId ? (
    <>
      <Script
        id='_next-gtm-init'
        dangerouslySetInnerHTML={{
          __html: `
      (function(w,l){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
      })(window,'${dataLayerName}');`,
        }}
        nonce={nonce}
      />
      <Script
        id='_next-gtm'
        data-ntpc='GTM'
        async
        src={`${gtmScriptUrl}?id=${gtmId}`}
        nonce={nonce}
      />
    </>
  ) : null;
}
