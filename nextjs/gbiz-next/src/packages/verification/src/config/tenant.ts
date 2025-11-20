/**
 * Owner: vijay.zhou@kupotech.com
 */
// 多租户默认配置
import merge from 'lodash-es/merge';
import { bootConfig } from 'kc-next/boot';
import addLangToPath from 'tools/addLangToPath';
import { getSiteConfig } from 'kc-next/boot';
import { getCurrentLang } from 'kc-next/i18n';

// 多租户默认配置 - 按页面或功能模块分类
const defaultConfig = () => {
  const siteConfig = getSiteConfig();
  return {
    supportUrl: addLangToPath(siteConfig.KUCOIN_HOST + '/support/requests'),
  }
};

// global 站配置
const KC: () => ReturnType<typeof defaultConfig> = () => merge({}, defaultConfig(), {});

// 澳洲站配置
const AU: () => ReturnType<typeof defaultConfig> = () => merge({}, defaultConfig(), {});

// 欧洲站配置
const EU: () => ReturnType<typeof defaultConfig> = () => merge({}, defaultConfig(), {});

// 土耳其站配置
const TR: () => ReturnType<typeof defaultConfig> = () => merge({}, defaultConfig(), {});

// 泰国站配置
const TH: () => ReturnType<typeof defaultConfig> = () => {
  const currentLang = getCurrentLang();
  return merge({}, defaultConfig(), {
    supportUrl: `https://kucoin-th.zendesk.com/hc/${currentLang === 'en_US' ? 'en-us' : 'th'}/requests/new`,
  })
};

// claim 站配置
const CL: () => ReturnType<typeof defaultConfig> = () => {
  const siteConfig = getSiteConfig();
  const { KC_SITE_HOST = '' } = siteConfig;
  // 申领站没有客服页面，跳到主站的客服页面
  return merge({}, defaultConfig(), {
    supportUrl: addLangToPath(KC_SITE_HOST + '/support/requests'),
  })
};


const tenantConfigs = {
  KC,
  TR,
  TH,
  CL,
  AU,
  EU,
} as const;

export const getTenantConfig = () => {
  return tenantConfigs[bootConfig._BRAND_SITE_ as keyof typeof tenantConfigs]() || KC();
}