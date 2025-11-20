/*
 * @Owner: sean.shi@kupotech.com
 * @Author: sean.shi sean.shi@kupotech.com
 * @Date: 2025-05-23 16:12:29
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-06-28 10:42:45
 * @FilePath: /kucoin-main-web/src/config/tenant.js
 * @Description: 多租户配置
 */

// 多租户默认配置 - 按页面或功能模块分类
const defaultConfig = {
  enableIpRestrictLang: true,
  futuresSocketBlock: false,
  showNewVenturesPage: false,
  aboutUs: {},
  common: {
    showFooter: true, // 是否展示 footer
    showDepositBanner: true, // 是否展示入金 banner
  },
  security: {
    showNews: true, // 安全首页是否展示News模块
    showHelper: true, // 安全首页是否展示Helper模块
    showProof: true, // 安全首页是否展示Proof模块
    showPor: true, // 安全页内容是否展示 2-4-5 PoR
    showBountyProgram: true, // 安全页内容是否展示 4-3-1 4-4-1 是否展示“Bounty Program”
  },
  careers: {
    show: true, // 加入我们-职业是否展示
  },
};

// global 站配置
const KC = {
  ...defaultConfig,
  siteRoute: 'KC_ROUTE',
  showNewVenturesPage: true,
  aboutUs: {
    showNewPage: true,
    showGlobalBannerLinks: true,
    useGlobalPeriod: true,
    useDynamicData: true,
  },
};

// EU 站配置
const EU = {
  ...defaultConfig,
  siteRoute: 'EU_ROUTE',
  showNewVenturesPage: true,
  aboutUs: {
    showNewPage: true,
    showGlobalBannerLinks: true,
    useGlobalPeriod: true,
    useDynamicData: true,
  },
};

// AU 站配置
const AU = {
  ...defaultConfig,
  siteRoute: 'AU_ROUTE',
  showNewVenturesPage: true,
  aboutUs: {
    showNewPage: true,
    showGlobalBannerLinks: true,
    useGlobalPeriod: true,
    useDynamicData: true,
  },
};

// 土耳其站配置
const TR = {
  ...defaultConfig,
  siteRoute: 'TR_ROUTE',
  enableIpRestrictLang: false,
  futuresSocketBlock: true,
};

// 泰国站配置
const TH = {
  ...defaultConfig,
  siteRoute: 'TH_ROUTE',
  enableIpRestrictLang: false,
  futuresSocketBlock: true,
  aboutUs: {
    showTHPage: true,
  },
  security: {
    showNews: false, // 安全首页是否展示News模块
    showHelper: false, // 安全首页是否展示Helper模块
    showProof: false, // 安全首页是否展示Proof模块
    showPor: false, // 安全页内容是否展示 2-4-5 PoR
    showBountyProgram: false, // 安全页内容是否展示 4-3-1 4-4-1 是否展示“Bounty Program”
  },
  careers: {
    show: false, // 加入我们-职业是否展示
  },
};

// claim 站配置
const CL = {
  ...defaultConfig,
  siteRoute: 'CL_ROUTE',
  enableIpRestrictLang: false,
  futuresSocketBlock: true,
  common: {
    showFooter: false,
    showDepositBanner: false,
  },
};

// 用 KC 兜底
const tenant = window._BRAND_SITE_;
const tenantConfig = {
  KC,
  EU,
  AU,
  TR,
  TH,
  CL,
}[tenant] || KC;

export { tenantConfig, tenant };
