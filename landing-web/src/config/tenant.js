/**
 * Owner: terry@kupotech.com
 */
// 多租户默认配置

const defaultConfig = {
  enableIpRestrictLang: true, // 是否启用 IP 限制语言: true
  siteRoute: 'KC_ROUTE',
};

// global 站配置
const KC = {
  ...defaultConfig,
};

// 土耳其站配置
const TR = {
  ...defaultConfig,
  enableIpRestrictLang: false,
  siteRoute: 'TR_ROUTE',
};

// 泰国站配置
const TH = {
  ...defaultConfig,
  enableIpRestrictLang: false,
  siteRoute: 'TH_ROUTE',
};

// 提币平台
const CL = {
  ...defaultConfig,
  enableIpRestrictLang: false,
  siteRoute: 'CL_ROUTE',
};


const tenant = window._BRAND_SITE_;

const tenantConfig =
  {
    KC,
    TR,
    TH,
    CL,
  }[tenant] || KC;

export { tenantConfig, tenant };
