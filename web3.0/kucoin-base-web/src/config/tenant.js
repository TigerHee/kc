// 多租户默认配置
const defaultConfig = {
  enableOneTrust: false, // 是否引入 oneTrust
  oneTrustHiddenInDev: false, // 是否在线下环境隐藏 oneTrust
  registerServiceWroker: true, // 是否注册 Service Worker
  disabledRouteToHome: false, // 是否禁用路由跳转到首页，共享站配置为 true，非共享站跳转到404
};

// global 站配置
const KC = {
  ...defaultConfig,
  disabledRouteToHome: true,
};

// 澳洲站配置
const AU = {
  ...defaultConfig,
  enableOneTrust: true,
  disabledRouteToHome: true,
};

// 欧洲站配置
const EU = {
  ...defaultConfig,
  enableOneTrust: true,
  disabledRouteToHome: true,
};

// 土耳其站配置
const TR = {
  ...defaultConfig,
  enableOneTrust: true,
  registerServiceWroker: false,
};

// 泰国站配置
const TH = {
  ...defaultConfig,
  enableOneTrust: true,
  oneTrustHiddenInDev: true,
  registerServiceWroker: false,
};

// 提币平台
const CL = {
  ...defaultConfig,
  enableOneTrust: false,
  registerServiceWroker: false,
};

const tenant = window._BRAND_SITE_ || 'KC';
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
