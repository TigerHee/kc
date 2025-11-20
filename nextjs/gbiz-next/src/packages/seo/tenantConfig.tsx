/**
 * Owner: will.wang@kupotech.com
 */

const defaultConfig = {
  /** hreflang是否不需要locale，只要lang */
  hreflangNoLocale: false,
  /** 是否展示og:site-name和twitter:sitename */
  ogAndTwitterSiteNameConfig: null,
};

const KC = {
  ...defaultConfig,
};

const TR = {
  ...defaultConfig,
};

const TH = {
  ...defaultConfig,
  hreflangNoLocale: true,
  ogAndTwitterSiteNameConfig: {
    ogSiteName: <meta property="og:site_name" content="KuCoin Thailand" />,
    twSiteName: <meta name="twitter:site" content="@KuCoinThailand" />,
  },
};

const CL = {
  ...defaultConfig,
};

const AU = {
  ...defaultConfig,
};
const EU = {
  ...defaultConfig,
};

const tenantConfigs = {
  KC,
  TR,
  TH,
  CL,
  AU,
  EU
};


export const getTenantConfig = (site = 'KC') => {
  // eslint-disable-next-line prototype-pollution/no-bracket-notation-property-accessor
  return tenantConfigs[site] || KC;
}
