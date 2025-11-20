import { bootConfig } from 'kc-next/boot';

export type TTenantCode = 'KC' | 'TR' | 'AU' | 'EU' | 'CL' | 'TH' | 'DEMO';
export interface ITenantConfig {
  siteRoute: 'KC_ROUTE' | 'TR_ROUTE' | 'TH_ROUTE' | 'CL_ROUTE';
  common: {
    forceLightTheme: boolean; // 是否强制白天主题
    useCLHeader: boolean; // 是否使用 claim 站点 header
    useCLLogin: boolean; // 是否使用 claim 站点 login
    showFooter: boolean;
    showSiteRedirectDialog: boolean; // 展示站点切换弹窗，共享站需要
    showCurrency: boolean; // 是否请求币服接口
  };
  signup: {
    isShowMktContent: boolean; // 是否提供 LottieProvider
    isBtnUseDefaultText: boolean; // 注册按钮是否用素文案
    needCenter: boolean; // 注册页面是否是居中模式
  };
  signin: {
    sloganTitle: (_t) => string;
    sloganSubTitle: (_t) => string;
  };
}

// 多租户默认配置
const defaultConfig: ITenantConfig = {
  siteRoute: 'KC_ROUTE',
  common: {
    forceLightTheme: false,
    useCLHeader: false,
    useCLLogin: false,
    showFooter: true,
    showSiteRedirectDialog: false,
    showCurrency: true,
  },
  signup: {
    isShowMktContent: true,
    isBtnUseDefaultText: false,
    needCenter: true,
  },
  signin: {
    sloganTitle: (_t) => _t('new_version_guide_title_one'),
    sloganSubTitle: (_t) => _t('jFfRryspo7BhZ3nEzEWw97'),
  },
} as const;

// global 站配置
const KC: ITenantConfig = {
  ...defaultConfig,
  common: {
    ...defaultConfig.common,
    showSiteRedirectDialog: true,
  },
  signup: {
    ...defaultConfig.signup,
    needCenter: false,
  },
} as const;

// 澳大利亚站配置
const AU: ITenantConfig = {
  ...defaultConfig,
  signup: {
    ...defaultConfig.signup,
    isShowMktContent: false,
    isBtnUseDefaultText: true,
  },
  signin: {
    ...defaultConfig.signin,
    sloganTitle: (_t) => _t('e04df0dae72b4800acbb'),
    sloganSubTitle: (_t) => _t('39517a340e614000aa1f'),
  },
} as const;

// 欧洲站配置
const EU: ITenantConfig = {
  ...defaultConfig,
  signup: {
    ...defaultConfig.signup,
    isShowMktContent: false,
    isBtnUseDefaultText: true,
  },
} as const;

const TR: ITenantConfig = {
  ...defaultConfig,
  common: {
    ...defaultConfig.common,
    forceLightTheme: true,
  },
  signup: {
    ...defaultConfig.signup,
    isShowMktContent: false,
    isBtnUseDefaultText: true,
  },
  siteRoute: 'TR_ROUTE',
} as const;

const TH: ITenantConfig = {
  ...defaultConfig,
  signup: {
    ...defaultConfig.signup,
    isShowMktContent: false,
    isBtnUseDefaultText: true,
  },
  siteRoute: 'TH_ROUTE',
} as const;

const CL: ITenantConfig = {
  ...defaultConfig,
  siteRoute: 'CL_ROUTE',
  common: {
    ...defaultConfig.common,
    useCLHeader: true,
    useCLLogin: true,
    showFooter: false,
    showCurrency: false,
  },
} as const;

const tenantConfigMap = { KC, AU, EU, TH, TR, CL } as const;

export const getTenantConfig = (): typeof defaultConfig =>
  tenantConfigMap[bootConfig._BRAND_SITE_ as keyof typeof tenantConfigMap] ||
  KC;
