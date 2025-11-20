import { registerApplication, start } from '@apps';
import {
  assetsWebPaths,
  briskWebPaths,
  cashbackReferralWebPaths,
  customerWebPaths,
  fastCoinWebPaths,
  kucoinpayWebPaths,
  marginPathsUrls,
  marketingGrowthWebPaths,
  newsWebPaths,
  paymentWebPaths,
  platformOperationWebPaths,
  publicWebPaths,
  seoCmsWebPaths,
  seoLearnWebPaths,
  seoPriceWebPaths,
  seoSitemapWebPaths,
  seoWebPaths,
  tradePublicWebPaths,
  ucenterWebPaths,
} from '@config';
import { tenantConfig } from '@config/tenant';
import JsBridge from '@kucoin-base/bridge';
import { basename, currentLang } from '@kucoin-base/i18n';
import '@kucoin-base/kunlun';
import sensors from '@kucoin-base/sensors';
import kunlun from '@kucoin-base/kunlun';
import storage from '@kucoin-base/syncStorage';
import { IS_PROD, IS_TEST_ENV } from '@utils/env';
import { initMetrics } from '@utils/performanceMetrics';
import { registerServiceWroker, unRegisterServiceWroker } from '@utils/serviceWroker';
import {
  isBotTradePathValid,
  isEarnPathValid,
  isFuturesPathValid,
  isTradePathValid,
} from '@utils/validatePath';
import { matchPath } from 'react-router-dom';
import { ONE_TRUST_LANG_MAP } from './config/oneTrust';

const isInApp = JsBridge.isApp();

const currentSite = window._BRAND_SITE_;

// 开启 oneTrust 功能
if (tenantConfig.enableOneTrust) {
  window.onOneTrustLoaded?.(() => {
    try {
      // 在 APP 中，直接允许所有，关闭 OneTrust
      if (isInApp) {
        window.OneTrust.AllowAll();
        return;
      }
      // 线下环境隐藏 oneTrust，目前只有泰国站需要
      if (tenantConfig.oneTrustHiddenInDev && !IS_PROD) {
        window.OneTrust.AllowAll();
        return;
      }
      const oneTrustLang = ONE_TRUST_LANG_MAP[currentLang] || window._DEFAULT_LOCALE_;
      window.OneTrust.changeLanguage(oneTrustLang);

      setTimeout(() => {
        // 语言准备好之后，再展示 oneTrust 的 UI
        const style = document.getElementById('custom-onetrust-style');
        if (style) {
          style.remove();
        }
      }, 300);
    } catch (error) {
      console.error('OneTrust error', error);
    }
  });
}

// 这里只对主站生效
const nextUrl = new URL(location);
let ipRestrictLang = nextUrl.searchParams.get('x');
if (ipRestrictLang) {
  if (ipRestrictLang === 'l') {
    ipRestrictLang = 'fr_FR';
  }
  window.ipRestrictCountry = ipRestrictLang;
  nextUrl.searchParams.delete('x');
  if (storage.getItem('lang') === ipRestrictLang) {
    storage.setItem('lang', 'en_US');
  }
  if (nextUrl.searchParams.get('lang') === ipRestrictLang) {
    nextUrl.searchParams.delete('lang');
  }
  history.replaceState({}, '', nextUrl);
}

// 统一计算DCLTIME时间，给 onpagemount 桥方法使用，传给 APP 上报神策
try {
  if (isInApp) {
    let entries = performance.getEntriesByType('navigation');
    if (entries.length > 0) {
      window.DCLTIME = entries[0].domContentLoadedEventEnd - entries[0].startTime;
      console.log('DOMContentLoaded event time: ' + window.DCLTIME + ' ms');
    } else {
      window.DCLTIME =
        performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    }
  }
} catch (e) {
  console.log('DOMContentLoaded error: ' + e);
}

const mainWebExcludePaths = [
  ...ucenterWebPaths,
  ...marketingGrowthWebPaths,
  ...seoWebPaths,
  ...paymentWebPaths,
  ...platformOperationWebPaths,
  ...cashbackReferralWebPaths,
  ...seoSitemapWebPaths,
];

const config = {
  env: IS_TEST_ENV ? 'development' : process.env.NODE_ENV,
  abtest_url: `https://ab.kucoin.plus/api/v2/abtest/online/results?project-key=${
    IS_TEST_ENV || process.env.NODE_ENV === 'development'
      ? '36DBB03C8F0BA07957A1210633E218AA72F82017'
      : '002DF87B8629B86AC8A602E685FF6EE4CDA5BB0F'
  }`,
  log: process.env.REACT_APP_SENSORS_LOG || false,
};

sensors.init(config);

// 注册 service worker
if (!isInApp) {
  if (tenantConfig.registerServiceWroker) {
    registerServiceWroker();
  } else {
    unRegisterServiceWroker();
  }
}

// ucenter-web路由是精确匹配，放在最上面
registerApplication({
  name: 'ucenter-web',
  entry: `${process.env.REACT_APP_UCENTER_WEB_MAP}`,
  load() {
    return System.import('ucenter-web/app');
  },
  activeWhen(location) {
    if (ucenterWebPaths.some((path) => !!matchPath(location.pathname, { path, exact: true }))) {
      return true;
    }
    return false;
  },
});

// brisk-web路由是精确匹配，放在前面
registerApplication({
  name: 'brisk-web',
  entry: `${process.env.REACT_APP_BRISK_WEB_MAP}`,
  load() {
    return System.import('brisk-web/app');
  },
  activeBrandKeys: ['KC', 'TH', 'TR', 'AU', 'EU', 'DEMO'],
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    return briskWebPaths.some((path) => !!matchPath(location.pathname, { path, exact: true }));
  },
});

// template test web  cicd 测试使用
registerApplication({
  name: 'template-web',
  entry: `${process.env.REACT_APP_TEMPLATE_WEB_MAP}`,
  load() {
    return System.import('template-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    return ['/template'].some((path) => {
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    });
  },
});

registerApplication({
  name: 'kumex-pro',
  entry: `${process.env.REACT_APP_KUMEX_PRO_MAP}`,
  historyOptions: { basename: basename ? `${basename}/futures` : '/futures' },
  load() {
    return System.import('kumex-pro/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    const locationMatch = isFuturesPathValid(location?.pathname);
    return locationMatch;
  },
});

// seo-web
registerApplication({
  name: 'kucoin-seo-web',
  entry: `${process.env.REACT_APP_SEO_WEB_MAP}`,
  load() {
    return System.import('kucoin-seo-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    return seoWebPaths.some((path) => {
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    });
  },
});

// seo-sitemap-web
registerApplication({
  name: 'seo-sitemap-web',
  entry: `${process.env.REACT_APP_SEO_SITEMAP_WEB_MAP}`,
  load() {
    return System.import('seo-sitemap-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    return seoSitemapWebPaths.some((path) => {
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    });
  },
});

// seo-learn-web
registerApplication({
  name: 'seo-learn-web',
  entry: `${process.env.REACT_APP_SEO_LEARN_WEB_MAP}`,
  load() {
    return System.import('seo-learn-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    return seoLearnWebPaths.some((path) => {
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    });
  },
});

// seo-price-web
registerApplication({
  name: 'seo-price-web',
  entry: `${process.env.REACT_APP_PRICE_WEB_MAP}`,
  load() {
    return System.import('seo-price-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    return seoPriceWebPaths.some((path) => {
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    });
  },
});

// news-web
registerApplication({
  name: 'news-web',
  entry: `${process.env.REACT_APP_NEWS_WEB_MAP}`,
  load() {
    return System.import('news-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    return newsWebPaths.some((path) => {
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    });
  },
});

// seo-cms-web
registerApplication({
  name: 'seo-cms-web',
  entry: `${process.env.REACT_APP_SEO_CMS_WEB_MAP}`,
  load() {
    return System.import('seo-cms-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    return seoCmsWebPaths.some((path) => {
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    });
  },
});

// trade-public-web(行情改版2.0)
registerApplication({
  name: 'trade-public-web',
  entry: `${process.env.REACT_APP_MARKET_WEB_MAP}`,
  load() {
    return System.import('trade-public-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    const paths = [...tradePublicWebPaths];

    return paths.some((path) => {
      if (path === '/') {
        return location.pathname === path;
      } else {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
      }
    });
  },
});

registerApplication({
  name: 'trade-web',
  entry: `${process.env.REACT_APP_TRADE_WEB_MAP}`,
  historyOptions: { basename: basename ? `${basename}/trade` : '/trade' },
  load() {
    return System.import('trade-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    const locationMatch = isTradePathValid(location?.pathname);
    return locationMatch;
  },
});

// 赚币 pool-x-web app
registerApplication({
  name: 'pool-x-web',
  entry: `${process.env.REACT_APP_POOL_X_WEB_MAP}`,
  historyOptions: { basename: basename ? `${basename}/earn` : '/earn' },
  load() {
    return System.import('pool-x-web/app');
  },
  activeBrandKeys: ['KC', 'TR', 'AU', 'EU'],
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    const locationMatch = isEarnPathValid(location?.pathname);
    return locationMatch;
  },
});

// 老版本public-web
registerApplication({
  name: 'public-web',
  entry: `${process.env.REACT_APP_PUBLIC_WEB_MAP}`,
  load() {
    return System.import('public-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    // 命中到ucenter-web的页面，一律return false（解决跨项目跳转locale文件不更新的问题）
    if (ucenterWebPaths.some((path) => !!matchPath(location.pathname, { path, exact: true }))) {
      return false;
    }

    return publicWebPaths.some((path) => {
      if (path === '/') {
        return location.pathname === path;
      } else {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
      }
    });
  },
});

// 支付payment-web
registerApplication({
  name: 'payment-web',
  entry: `${process.env.REACT_APP_PAYMENT_WEB_MAP}`,
  load() {
    return System.import('payment-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    return paymentWebPaths.some((path) => !!matchPath(location.pathname, { path }));
  },
});

// 支付fast-coin-web
registerApplication({
  name: 'fast-coin-web',
  entry: `${process.env.REACT_APP_FAST_COIN_WEB_MAP}`,
  load() {
    return System.import('fast-coin-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    return fastCoinWebPaths.some((path) => !!matchPath(location.pathname, { path }));
  },
});

//支付 kucoinpay-web
registerApplication({
  name: 'kucoinpay-web',
  entry: `${process.env.REACT_APP_KUCOINPAY_WEB_MAP}`,
  load() {
    return System.import('kucoinpay-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    return kucoinpayWebPaths.some((path) => !!matchPath(location.pathname, { path }));
  },
});

// 营销marketing-growth-web
registerApplication({
  name: 'marketing-growth-web',
  entry: `${process.env.REACT_APP_MARKETING_GROWTH_WEB_MAP}`,
  load() {
    return System.import('marketing-growth-web/app');
  },
  // activeSiteConfig: () => true, // 这里先全部放开，具体页面是否可见由项目内部的路由配置控制
  // activeBrandKeys: ['KC', 'TR', 'TH', 'EU', 'AU'],
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    return marketingGrowthWebPaths.some((path) => !!matchPath(location.pathname, { path }));
  },
});

// platform-operation-web
registerApplication({
  name: 'platform-operation-web',
  entry: `${process.env.REACT_APP_PLATFORM_OPERATION_WEB_MAP}`,
  load() {
    return System.import('platform-operation-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    // 命中到platform-operation-web的页面，一律return false（解决跨项目跳转locale文件不更新的问题）
    if (
      platformOperationWebPaths.some(
        (path) => !!matchPath(location.pathname, { path, exact: true }),
      )
    ) {
      return true;
    }
    return false;
  },
});

// cashback-referral-web
registerApplication({
  name: 'cashback-referral-web',
  entry: `${process.env.REACT_APP_CASHBACK_REFERRAL_WEB_MAP}`,
  load() {
    return System.import('cashback-referral-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    // 命中到cashback-referral-web的页面，一律return false（解决跨项目跳转locale文件不更新的问题）
    if (
      cashbackReferralWebPaths.some((path) => !!matchPath(location.pathname, { path, exact: true }))
    ) {
      return true;
    }
    return false;
  },
});

// 新版本margin
registerApplication({
  name: 'margin-web-3.0',
  entry: `${process.env.REACT_APP_MARGIN_WEB_3_MAP}`,
  load() {
    return System.import('margin-web-3.0/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    return marginPathsUrls.some((path) => !!matchPath(location.pathname, { path }));
  },
});

// 机器人 professional-web
registerApplication({
  name: 'professional-web',
  entry: `${process.env.REACT_APP_PROFESSIONAL_WEB_MAP}`,
  historyOptions: { basename: basename ? `${basename}/trading-bot` : '/trading-bot' },

  load() {
    return System.import('professional-web/app');
  },
  activeBrandKeys: ['KC'],
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    const locationMatch = isBotTradePathValid(location?.pathname);
    return locationMatch;
  },
});

// 后端产研维护的客服模块
registerApplication({
  name: 'customer-web',
  entry: `${process.env.REACT_APP_CUSTOMER_WEB_MAP}`,
  load() {
    return System.import('customer-web/app');
  },
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    const paths = [...customerWebPaths];
    // 命中到ucenter-web的页面，一律return false（解决跨项目跳转locale文件不更新的问题）
    if (ucenterWebPaths.some((path) => !!matchPath(location.pathname, { path, exact: true }))) {
      return false;
    }

    if (location.pathname.startsWith('/legal')) {
      // 判断路径是否需要跳转到public-web
      const isPathInPublicWeb = publicWebPaths.some(
        (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
      );
      return !isPathInPublicWeb;
    }

    return paths.some((path) => {
      if (path === '/') {
        return location.pathname === path;
      } else {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
      }
    });
  },
});

// assets-web
registerApplication({
  name: 'assets-web',
  entry: `${process.env.REACT_APP_ASSETS_WEB_3_MAP}`,
  load() {
    return System.import('assets-web/app');
  },
  activeBrandKeys: ['KC', 'TR', 'TH', 'CL', 'AU', 'EU'],
  activeWhen(location) {
    if (assetsWebPaths.some((path) => !!matchPath(location.pathname, { path, exact: true }))) {
      return true;
    }
    return false;
  },
});

// kucoin-th-static 泰国站临时应用，泰国站二期正式运营后会删掉
registerApplication({
  name: 'kucoin-th-static',
  entry: `${process.env.REACT_APP_KUCOIN_TH_STATIC_MAP}`,
  load() {
    return System.import('kucoin-th-static/app');
  },
  activeBrandKeys: ['TH'],
  activeWhen(location) {
    if (['CL'].includes(currentSite)) {
      return false;
    }
    const pathname = location?.pathname;
    if (!pathname) return false;
    // 匹配 /home 开头的pathname
    const regex = /^\/home(\/.*)?$/;
    return regex.test(pathname);
  },
});

// main-web
registerApplication({
  name: 'kucoin-main-web',
  entry: `${process.env.REACT_APP_MAIN_WEB_MAP}`,
  load() {
    return System.import('kucoin-main-web/app');
  },
  // kucoin-main-web 不配置 activeBrandKeys，需要对所有站点都生效，因为要用到里面的 404 页面
  activeWhen(location) {
    // 命中到 excludePaths 的页面，一律return false（解决跨项目跳转locale文件不更新的问题）
    if (mainWebExcludePaths.some((path) => !!matchPath(location.pathname, { path, exact: true }))) {
      return false;
    }
    return true;
  },
});

const root = document.getElementById('root');
//如果检测到低版本浏览器不支持，则不挂载应用
if (!window._IS_NOT_SUPPORT_BROWSER_) {
  start(root);
  initMetrics(sensors, kunlun);
}
