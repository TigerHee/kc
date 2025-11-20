/**
 * Owner: terry@kupotech.com
 */
// 多租户默认配置
import { bootConfig } from 'kc-next/boot';

const defaultConfig = {
  enableComplianceFR: true, // 是否开启法规rcode合规
};

// global 站配置
const KC = {
  ...defaultConfig,
};

// 土耳其站配置
const TR = {
  ...defaultConfig,
  enableComplianceFR: false,
};

// 泰国站配置
const TH = {
  ...defaultConfig,
  enableComplianceFR: false,
};

// au站配置
const AU = {
  ...defaultConfig,
  enableComplianceFR: false,
};

// eu站配置
const EU = {
  ...defaultConfig,
  enableComplianceFR: false,
};

// 提币平台
const CL = {
  ...defaultConfig,
  enableComplianceFR: false,
};

const tenantConfigs = {
    KC,
    TR,
    TH,
    CL,
    AU,
    EU,
};

export const getTenantConfig = () => {
  return tenantConfigs[bootConfig._BRAND_SITE_] || KC;
}
