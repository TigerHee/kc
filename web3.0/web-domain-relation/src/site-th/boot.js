import baseConfig from "./tpl-th";
import rewriteConsole from "../console";

// default
window._WEB_RELATION_ = {};
window._BRAND_SITE_ = 'TH';
window._BRAND_SITE_FULL_NAME_ = 'thailand';
window._BRAND_NAME_ = 'KuCoin TH';
window._BRAND_LOGO_ = `https://assets.staticimg.com/${__DIST_PATH__}/th/logo.svg`;
window._BRAND_LOGO_MINI_ = `https://assets.staticimg.com/${__DIST_PATH__}/th/mini_logo.svg`;
window._BRAND_LOGO_BIG_ = `https://assets.staticimg.com/${__DIST_PATH__}/th/big_logo.svg`;
window._BRAND_LOGO_WHITE_ = `https://assets.staticimg.com/${__DIST_PATH__}/th/white_logo.svg`;
window._BRAND_LOGO_GRAY_ = `https://assets.staticimg.com/${__DIST_PATH__}/th/gray_logo.svg`;

const BACKUP_DOMAINS = [
  'www.kucoin-th.cloud',
  'www.kucoin-th.biz',
  'www.kucoin.com.th',
];
window._SAFE_WEB_DOMAIN_ = [
  "www.kucoin.th",
  "www.kucoin-th.plus",
  "kucoin-th.zendesk.com",
  "th.kucoin.com",
  ...BACKUP_DOMAINS,
];

window._LANG_DOMAIN_ = ["www.kucoin.", "www.kucoin-th."];
window._DEFAULT_LANG_ = 'th_TH';
window._DEFAULT_LOCALE_ = 'th';
window._BASE_CURRENCY_ = 'USDT';
window._DEFAULT_PATH_ = '';

// lock boot
window._WEB_RELATION_BOOTED_ = false;
(function () {
  /**
   * Check if loaded
   */
  if (window._WEB_RELATION_BOOTED_) {
    console.warn("WEB_DOMAIN TRY TO REEVAL!!!");
    return;
  }
  window._WEB_RELATION_BOOTED_ = true;

  /**
   * 动态加载脚本
   * @param {*} url
   */
  function loadScript() {
    let curTld = location.hostname.split(".").reverse()[0];
    const isLocalDev = curTld.indexOf("localhost") > -1;
    // 当本地开发时，使用 net
    if (isLocalDev) {
      curTld = "net";
    }
    const isOffline = curTld === 'net';
    // 泰国站备份域名 kucoin-th.com
    const isBak = BACKUP_DOMAINS.indexOf(location.hostname) > -1;

    rewriteConsole(isLocalDev);

    const siteConfig = {};
    const hostReg = /\{host\}/;
    const tldReg = /\{tld\}/;
    Object.keys(baseConfig).forEach((key) => {
      if (key === 'BRAND_ORIGIN') {
        siteConfig[key] = baseConfig[key];
        return;
      }
      if (tldReg.test(baseConfig[key])) {
        if (!isBak) {
          siteConfig[key] = baseConfig[key].replace(tldReg, 'com');
        } else {
          siteConfig[key] = baseConfig[key].replace(tldReg, 'cloud');
        }
        siteConfig[`${key}_CN`] = baseConfig[key].replace(tldReg, 'com'); // 兼容主站的 _CN 配置，设置为固定域名
        siteConfig[`${key}_COM`] = baseConfig[key].replace(tldReg, 'com'); // 兼容主站的 _COM 配置，设置为固定域名
      } else {
        siteConfig[key] = baseConfig[key].replace(hostReg, location.host);
        siteConfig[`${key}_CN`] = baseConfig.BRAND_ORIGIN; // 兼容主站的 _CN 配置，设置为固定域名
        siteConfig[`${key}_COM`] = baseConfig.BRAND_ORIGIN; // 兼容主站的 _COM 配置，设置为固定域名
      }

      if (isOffline) {
        if (!isLocalDev && !baseConfig.env) {
          // 线下环境五级域名 xxx.xx.sit.kucoin.net
          const levels = location.hostname.split('.');
          baseConfig.env = ['sit', 'dev'].includes(levels[2]) ? levels[2] : 'sit';
          baseConfig.ng = levels[0].match(/-(\d+)$/)?.[1] || '01';
        }
        if (tldReg.test(baseConfig[key])) {
          siteConfig[key] = baseConfig[key].replace(tldReg, curTld);
          siteConfig[key] = siteConfig[key].replace(/^(https:\/\/[^\.]+)\./, (_, $1) => `${$1}-${baseConfig.ng}.${baseConfig.env}.`);
        } else if (isLocalDev) {
          // 本地开发将主站调整为 http://localhost:xxxx
          siteConfig[key] = siteConfig[key].replace(`https://${location.host}`, location.origin);
        }
      }
    });

    return siteConfig;
  }

  // 引导加载
  try {
    window._WEB_RELATION_ = loadScript();
  } catch (e) {
    console.log("BOOT RELATION ERR", e);
  }
})();
