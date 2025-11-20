/**
 * Owner: will.wang@kupotech.com
 */

import { bootConfig } from 'kc-next/boot';

interface TenantConfig {
  /** - 站点路由 **/
  siteRoute: string;
  /**  - 是否在详情页面包屑中展示price首页 **/
  showDetailIndexBreadcrumb: boolean;
  /**  - 是否在币种详情中显示tab及其内容 **/
  showDetailTab: boolean;
  /**  - 是否在币种详情中显示广告 **/
  showDetailAd: boolean;
  /**  - 是否在币种详情中显示converter表格 **/
  showDetailConverterTable: boolean;
  /**  - 是否在币种详情中显示币种排行 **/
  showDetailCoinRank: boolean;
  /**  - 是否在币种详情中显示learn & earn **/
  showDetailLearnAndEarn: boolean;
  /**  - 是否在币种详情中显示推荐文章 **/
  showDetailRecommendArticle: boolean;
  /**  - 是否在币种详情中显示买币交易 BuyCoinForm **/
  showDetailBuycoinForm: boolean;
  /**  - 是否在币种详情中显示推荐购买 **/
  showDetailRecommendBuy: boolean;
  /**  - 是否在币种详情中显示注册卡片 **/
  showDetailRegister: boolean;
  /**  - 是否在多租户文章详情中显示内链 **/
  showArticleInternalLink: boolean;
  /**  - 是否显示额外自定义价格字段（泰国站适配） **/
  showExtraLatestPriceKey: boolean;
  /**  - 是否显示APP分享 **/
  showAppShare: boolean;
  /**  - 法币汇率的基准货币 **/
  ratesBaseCurrency: string;
  /**  - 计价单位 **/
  balanceCurrency: string;
  /**  - 是否展示兑换table **/
  shouldShowConverterTableLink: boolean;
  shoudHideFuturesAndMargin: boolean;
}

const defaultConfig: TenantConfig = {
  siteRoute: 'KC_ROUTE',
  // 详情页面包屑是否展示price首页
  showDetailIndexBreadcrumb: true,
  // 币种详情是否显示tab及其内容
  showDetailTab: true,
  // 币种详情是否显示ad广告
  showDetailAd: true,
  // 币种详情是否显示converter表格
  showDetailConverterTable: true,
  // 币种详情是否显示币种排行
  showDetailCoinRank: true,
  // 币种详情是否显示learn & earn
  showDetailLearnAndEarn: true,
  // 币种详情是否显示推荐文章
  showDetailRecommendArticle: true,
  // 币种详情是否显示买币交易 BuyCoinForm
  showDetailBuycoinForm: true,
  // 币种详情是否显示推荐购买
  showDetailRecommendBuy: true,
  // 币种详情是否显示注册卡片
  showDetailRegister: true,
   // 多租户文章详情显示内链
  showArticleInternalLink: true,
  // 显示额外自定义价格字段，泰国站适配
  showExtraLatestPriceKey: false,
  showAppShare: true, // 是否显示APP分享
  ratesBaseCurrency: bootConfig._DEFAULT_RATE_CURRENCY_,
  balanceCurrency: bootConfig._BASE_CURRENCY_, // 计价单位
  shouldShowConverterTableLink: true,
  shoudHideFuturesAndMargin: false,
};

// global 站配置
const KC = {
  ...defaultConfig,
};

// 土耳其站配置
const TR = {
  ...defaultConfig,
  siteRoute: 'TR_ROUTE',
  showDetailLearnAndEarn: false,
  showArticleInternalLink: false,
  showAppShare: false,
  shouldShowConverterTableLink: false,
  shoudHideFuturesAndMargin: true,
};

// 泰国站配置
const TH = {
  ...defaultConfig,
  siteRoute: 'TH_ROUTE',
  showDetailLearnAndEarn: false,
  showArticleInternalLink: false,
  showExtraLatestPriceKey: true,
  showAppShare: false,
  // 泰国站使用USD作为法币汇率基准货币，兼容旧逻辑
  ratesBaseCurrency: 'USD',
  shouldShowConverterTableLink: false,
  shoudHideFuturesAndMargin: true,
};

// 欧洲站配置
const EU = {
  ...defaultConfig,
  siteRoute: 'KC_ROUTE',
  showDetailLearnAndEarn: false,
  showAppShare: false,
};

// 澳洲站配置
const AU = {
  ...defaultConfig,
  siteRoute: 'KC_ROUTE',
  showDetailLearnAndEarn: false,
  showAppShare: false,
};


const tenantConfigMap = {
  KC,
  TR,
  TH,
  AU,
  EU,
};

export const getTenantConfig = (): TenantConfig => {
  const supportLanguages = bootConfig.languages?.__ALL__;
  const tenant = bootConfig._BRAND_SITE_;
  const base = tenantConfigMap[tenant] || KC;

  if (tenant === 'TR' || tenant === 'TH') {
    return {
      ...base,
      supportLanguages,
    };
  }

  return base;
};

