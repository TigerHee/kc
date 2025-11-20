/*
 * @Owner: brick@kupotech.com
 * @Author: brick brick@kupotech.com
 * @Date: 2025-08-23 21:47:02
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-09-23 22:16:28
 * @FilePath: /brisk-web-ssr/src/tenant.ts
 * @Description: 多租户配置
 *
 *
 */
import { bootConfig } from 'kc-next/boot';

export type TTenantCode = 'KC' | 'TR' | 'AU' | 'EU' | 'CL' | 'TH' | 'DEMO';

// 多租户默认配置
const defaultConfig = {
  siteRoute: 'KC_ROUTE',
  enableSeoOrganization: true,
  loadProxyScript: true,
  showRewards: false,
  showAllSlogans: true, // 展示所有 slogan，澳洲站需要隐藏，后面会换 slogan
  showFilmEntry: true, // 展示视频链接入口
  sloganTitleKey: 'e55f61f431c74000acda',
  sloganSubTitleKey: '30e0baf518ee4800ae15',
  faqTitle: t => t('e9355bad01544000a294'),
  faqDescription: (t, params) => t('61d1dac6a5814000a97d', params),
  //  2025.09.23 红包租户合规 参考的 UC 那边的逻辑
  joinUsText: (t, params = {}) => t('10cc7451923f4800a5b3', params),
  // 动态导入 banner 视频（支持 Code Splitting，按需加载）
  bannerVideo: () => import('@/static/banner/banner_video.mp4'),
  guidanceImg: {
    lightImg: () => import('@/static/download/app_download_guidance.png'),
    darkImg: () => import('@/static/download/app_download_guidance_dark.png'),
  },
  common: {
    initLanguageCode: 'US', // 默认语言国家
    initCountryCode: '', // 默认区号
    isCountryCodeDisabled: false, // 选择区号是否禁用
    isCountryCodeUseInit: false, // 选择区号是否使用初始化
    dismissPT: false, // 是否禁止葡萄牙语区号
    notPreFillMobileCodeCountries: () => [], // 禁止自动预填写手机区号的国家
    forbiddenCountriesForUse: () => [
      {
        code: 'CN',
        mobileCode: '86',
        aliasName: '其他', // 被屏蔽的国家，界面显示的别名
        aliasNameEN: 'Other',
      },
    ], // 禁止使用的国家列表
  },
};

// global 站配置
const KC = {
  ...defaultConfig,
  showRewards: true,
  //  2025.09.23 红包租户合规 参考的 UC 那边的逻辑
  common: {
    ...defaultConfig.common,
    dismissPT: true, // 禁止葡萄牙语区号
    // 禁止自动预填写手机区号的国家：奥地利AT43
    notPreFillMobileCodeCountries: () => ['AT'],
  },
};

const AU = {
  ...defaultConfig,
  showFilmEntry: false,
  sloganTitleKey: '123d17f1089c4800a680',
  sloganSubTitleKey: '12e23955f8d84000a609',
  showAllSlogans: true,
  //  2025.09.23 红包租户合规 参考的 UC 那边的逻辑
  common: {
    ...defaultConfig.common,
    initLanguageCode: 'AU',
  },
};

const EU = {
  ...defaultConfig,
  joinUsText: t => t('63b26eb017f04800aa19'),
  // 欧洲站使用专属视频（动态导入，按需加载）
  bannerVideo: () => import('@/static/banner/banner_video_eu.mp4'),
  faqTitle: t => t('ca7d323e294b4800a0a7'),
  faqDescription: t => t('bd072b525e884000a051'),
  guidanceImg: {
    lightImg: () => import('@/static/download/app_download_guidance_eu.png'),
    darkImg: () => import('@/static/download/app_download_guidance_dark_eu.png'),
  },
  //  2025.09.23 红包租户合规 参考的 UC 那边的逻辑
  common: {
    ...defaultConfig.common,
    initLanguageCode: 'AT',
  },
};

const TR = {
  ...defaultConfig,
  siteRoute: 'TR_ROUTE',
  enableSeoOrganization: false,
  loadProxyScript: false,
  //  2025.09.23 红包租户合规 参考的 UC 那边的逻辑
  common: {
    ...defaultConfig.common,
    initLanguageCode: 'TR',
    initCountryCode: '90',
    isCountryCodeDisabled: true, // 选择区号是否禁用
    isCountryCodeUseInit: true, // 选择区号是否使用初始化
    forbiddenCountriesForUse: () => [],
  },
};

const TH = {
  ...defaultConfig,
  siteRoute: 'TH_ROUTE',
  enableSeoOrganization: false,
  loadProxyScript: false,
  //  2025.09.23 红包租户合规 参考的 UC 那边的逻辑
  common: {
    ...defaultConfig.common,
    initLanguageCode: 'TH',
    forbiddenCountriesForUse: () => [],
  },
};

const tenantConfigMap = { KC, AU, EU, TH, TR };

export const getTenantConfig = () => tenantConfigMap[bootConfig._BRAND_SITE_] || KC;
