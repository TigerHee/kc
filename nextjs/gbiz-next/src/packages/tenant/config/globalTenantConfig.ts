import { bootConfig } from 'kc-next/boot';

// 多租户默认配置
const defaultConfig = {
  enableOneTrust: false, // 是否引入 oneTrust
  oneTrustHiddenInDev: false, // 是否在线下环境隐藏 oneTrust
  enableIpRestrictLang: true, // 是否启用 IP 限制语言
  registerServiceWorker: true, // 是否注册 Service Worker
  disabledRouteToHome: false, // 是否禁用路由跳转到首页，共享站配置为 true，非共享站跳转到404
  gtmId: null, // 是否引入gtm, gtmId 存在则开启
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
  enableIpRestrictLang: false,
  registerServiceWorker: false,
  gtmId: null,
};

// 泰国站配置
const TH = {
  ...defaultConfig,
  enableOneTrust: true,
  oneTrustHiddenInDev: true,
  enableIpRestrictLang: false,
  registerServiceWorker: false,
  gtmId: 'GTM-TVZC72M4',
};

// 提币平台
const CL = {
  ...defaultConfig,
  enableOneTrust: false,
  enableIpRestrictLang: false,
  registerServiceWorker: false,
};

const tenantConfig = {
  KC,
  TR,
  TH,
  CL,
  AU,
  EU,
};

export type TenantConfig = typeof defaultConfig & {
  gtmId: string | null; // gtmId为 null 的情况
};
export type TTenantCode = 'KC' | 'TR' | 'AU' | 'EU' | 'CL' | 'TH' | 'DEMO';

export const getGlobalTenantConfig = (tenant?: TTenantCode): TenantConfig => {
  return tenantConfig[tenant || bootConfig._BRAND_SITE_ || 'KC'] || KC;
};
