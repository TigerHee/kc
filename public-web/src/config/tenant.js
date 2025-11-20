/**
 * Owner: jessie@kupotech.com
 */
// 主站下载链接配置
const googlePlayUrl = 'https://kucoin-android.onelink.me/xTQQ/pvve7hp8';

const appStoreUrl = 'https://kucoin-ios.onelink.me/L1k4/18p1goqs';
const appStoreUrlByIllegalGp = 'https://kucoin.onelink.me/iqEP/j2tazuba';

const apkUrl = 'https://kucoin-android.onelink.me/xTQQ/909khuy9';
const apkUrlByIllegalGp = 'https://kucoin.onelink.me/iqEP/j2tazuba';

const qrUrl = 'https://kucoin.onelink.me/iqEP/vtvi4da4';
const qrUrlByIllegalGp = 'https://kucoin.onelink.me/iqEP/j2tazuba';

// 多租户默认配置(true是展示)
const defaultConfig = {
  /**
   * 其他站点配置，如果没有siteRoute，默认与主站保持一致
   * 如果其他站点配置声明了自己的siteRoute，需要检查router.config里面每一个路由，对应该站点是否支持访问
   */
  siteRoute: 'KC_ROUTE',
  enableIpRestrictLang: true, // 是否支持根据 IP 限制语言

  showDownloadBanner: true, // 是否显示下载引导，在 H5 下最上面展示的下载引导
  showDepositBanner: true, // 是否显示充值引导，在 H5 下最上面展示的充值引导
  showCombineDownload: true, // 是否显示合并下载引导，在 H5 右下角出现的
  showKuReward: false, // 是否展示福利中心
  // 下载页配置
  downloadPageConfig: {
    googlePlayUrl,
    appStoreUrl,
    appStoreUrlByIllegalGp,
    apkUrl,
    apkUrlByIllegalGp,
    qrUrl,
    qrUrlByIllegalGp,
    getAppStoreUrl: (legalGp = true) => {
      return legalGp ? appStoreUrl : appStoreUrlByIllegalGp;
    },
    getGooglePlayUrl: (_legalGp = true) => {
      return googlePlayUrl;
    },
    getApkUrl: (legalGp = true) => {
      return legalGp ? apkUrl : apkUrlByIllegalGp;
    },
    getQrUrl: (legalGp = true) => {
      return legalGp ? qrUrl : qrUrlByIllegalGp;
    },
    isShowGooglePlay: (legalGp) => legalGp,
    isShowApk: () => true,
    isHideHeaderNav: false,
    showDownloadSlogan: true,
  },

  // 闪兑页配置
  convertPageConfig: {
    showTutorial: true, // 是否在FAQ中展示教程
    showConvertMore: true, // 是否展示more
    showConvertPlus: true, // 是否展示 convertPlus
    disabledOrderTypes: null,
  },

  kcsPageConfig: {
    enableExpressBuyCoin: false,  // /express 快捷买币
    bizTypes: {
      LOCKDROP: false
    }
  },
  /**
   * 有分享弹窗的页面，是否显示分享弹窗，默认配置false，只复制分享链接(避免合规问题)
   * 后续确认页面需要分享弹窗，需要分享弹窗多租户适配，包含前端logo素材适配，接口适配，然后对应站点showShareDialog设置为true
   */
  showShareDialog: false,
};

// global 站配置
const KC = {
  ...defaultConfig,
  showKuReward: true,
  kcsPageConfig: {
    enableExpressBuyCoin: true,  // /express 快捷买币
    bizTypes: {
      LOCKDROP: true
    }
  },
  showShareDialog: true,
};

// 土耳其站配置
const apkUrkTr = 'https://kucointr.onelink.me/NM0m/973fkf3j';
const appStoreUrlTr = apkUrkTr;
const googlePlayUrlTr = apkUrkTr;
const qrUrlTr = apkUrkTr;

const TR = {
  ...defaultConfig,
  siteRoute: 'TR_ROUTE',
  enableIpRestrictLang: false,
  showDownloadBanner: false,
  showDepositBanner: false,
  showCombineDownload: false,
  downloadPageConfig: {
    googlePlayUrl: googlePlayUrlTr,
    appStoreUrl: appStoreUrlTr,
    appStoreUrlByIllegalGp: appStoreUrlTr,
    apkUrl: apkUrkTr,
    apkUrlByIllegalGp: apkUrkTr,
    qrUrl: qrUrlTr,
    qrUrlByIllegalGp: qrUrlTr,
    getAppStoreUrl: (_legalGp = true) => {
      return appStoreUrlTr;
    },
    getGooglePlayUrl: (_legalGp = true) => {
      return googlePlayUrlTr;
    },
    getApkUrl: (_legalGp = true) => {
      return apkUrkTr;
    },
    getQrUrl: (_legalGp = true) => {
      return qrUrlTr;
    },
    isShowGooglePlay: (_legalGp) => true,
    isShowApk: () => false,
    isHideHeaderNav: true,
    showDownloadSlogan: false,
  },
  convertPageConfig: {
    disabledOrderTypes: ['USDD'],
  },
};

// 泰国站配置
const googlePlayUrlTH = 'https://kucointh.onelink.me/AiYm/dkabb2xw';
const appStoreUrlTh = 'https://kucointh.onelink.me/AiYm/3sry39qx';
const apkUrlTh = 'https://kucointh.onelink.me/AiYm/0a9yzxe6';
const qrUrlTh = 'https://kucointh.onelink.me/AiYm/h4niawn1';

const TH = {
  ...defaultConfig,
  siteRoute: 'TH_ROUTE',
  enableIpRestrictLang: false,
  showDownloadBanner: false,
  showDepositBanner: false,
  showCombineDownload: false,
  downloadPageConfig: {
    googlePlayUrl: googlePlayUrlTH,
    appStoreUrl: appStoreUrlTh,
    appStoreUrlByIllegalGp: appStoreUrlTh,
    apkUrl: apkUrlTh,
    apkUrlByIllegalGp: apkUrlTh,
    qrUrl: qrUrlTh,
    qrUrlByIllegalGp: qrUrlTh,
    getAppStoreUrl: (_legalGp = true) => {
      return appStoreUrlTh;
    },
    getGooglePlayUrl: (_legalGp = true) => {
      return googlePlayUrlTH;
    },
    getApkUrl: (_legalGp = true) => {
      return apkUrlTh;
    },
    getQrUrl: (_legalGp = true) => {
      return qrUrlTh;
    },
    isShowGooglePlay: (_legalGp) => true,
    isShowApk: () => true,
    isHideHeaderNav: false,
    showDownloadSlogan: false,
  },
  convertPageConfig: {
    disabledOrderTypes: ['USDD'],
  },
};

const AU = {
  ...defaultConfig,
  siteRoute: 'AU_ROUTE',
  convertPageConfig: {
    disabledOrderTypes: ['USDD'],
  },
};

const EU = {
  ...defaultConfig,
  siteRoute: 'EU_ROUTE',
  convertPageConfig: {
    disabledOrderTypes: ['LIMIT', 'USDD'],
  },
};

const tenant = window._BRAND_SITE_;
const tenantConfig =
  {
    KC,
    TR,
    TH,
    AU,
    EU,
  }[tenant] || KC;

export { tenantConfig, tenant };
