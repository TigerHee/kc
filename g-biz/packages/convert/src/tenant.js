/*
 * @owner: borden@kupotech.com
 */
// 多租户默认配置 - 按页面或功能模块分类
const defaultConfig = {
  showBuyCrypto: true,
};

// global站配置
const KC = {
  ...defaultConfig,
};

// 澳洲站配置
const AU = {
  ...defaultConfig,
  showBuyCrypto: false,
};

// 欧洲站配置
const EU = {
  ...defaultConfig,
  showBuyCrypto: false,
};

// 土耳其站配置
const TR = {
  ...defaultConfig,
  showBuyCrypto: false,
};

// 泰国站配置
const TH = {
  ...defaultConfig,
  showBuyCrypto: false,
};

// claim 站配置
const CL = {
  ...defaultConfig,
  showBuyCrypto: false,
};

// g-biz 用 KC 兜底
const tenant = window._BRAND_SITE_;
const tenantConfig =
  {
    KC,
    TR,
    TH,
    CL,
    AU,
    EU,
  }[tenant] || KC;

export { tenantConfig, tenant };
