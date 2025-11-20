import baseConfig from "./tpl";
import rewriteConsole from "./console";

// default
window._WEB_RELATION_ = {};
window._BRAND_SITE_ = 'KC';
window._BRAND_SITE_FULL_NAME_= 'global';
window._BRAND_NAME_ = 'KuCoin';
window._BRAND_LOGO_ = `https://assets.staticimg.com/${__DIST_PATH__}/kc/logo.svg`;
window._BRAND_LOGO_MINI_ = `https://assets.staticimg.com/${__DIST_PATH__}/kc/mini_logo.svg`;
window._BRAND_LOGO_BIG_ = `https://assets.staticimg.com/${__DIST_PATH__}/kc/big_logo.svg`;
window._BRAND_LOGO_WHITE_ = `https://assets.staticimg.com/${__DIST_PATH__}/kc/white_logo.svg`;
window._BRAND_LOGO_GRAY_ = `https://assets.staticimg.com/${__DIST_PATH__}/kc/gray_logo.svg`;

window._SAFE_WEB_DOMAIN_ = [
  "www.kucoin.com",
  "www.kucoin.cloud",
  "www.kucoin.biz",
  "www.kucoin.top",
  "www.kucoin.plus",
  "www.kucoin.work",
  "kucoin.zendesk.com",
];

window._LANG_DOMAIN_ = ["www.kucoin.", "www.kucoinauth."];

// lock boot
window._KC_WEB_RELATION_BOOTED_ = false;
(function () {
  /**
   * Check if loaded
   */
  if (window._KC_WEB_RELATION_BOOTED_) {
    console.warn("KC_WEB_DOMAIN TRY TO REEVAL!!!");
    return;
  }
  window._KC_WEB_RELATION_BOOTED_ = true;

  /**
   * 动态加载脚本
   * @param {*} url
   */
  function loadScript() {
    let curTld = location.hostname.split(".").reverse()[0];
    const isLocalDev = curTld.indexOf("localhost") > -1;
    // 当本地开发时，使用 net
    if (isLocalDev || curTld === 'io') {
      curTld = "net";
    }
    const isOffline = curTld === 'net';

    rewriteConsole(isLocalDev);

    let env = 'sit';
    let ng = '01';
    if (isOffline && !isLocalDev) {
      // 线下环境四级域名 xxx.sit.kucoin.net
      const levels = location.hostname.split('.');
      env = ['sit', 'dev'].includes(levels[1]) ? levels[1] : 'sit';
      ng = levels[0].match(/-(\d+)$/)?.[1] || '01';
    }

    const siteConfig = {};
    const tldReg = /\{tld\}/;
    const mainTld = 'com';
    Object.keys(baseConfig).forEach((key) => {
      const host = baseConfig[key].replace(tldReg, curTld);
      siteConfig[key] = host;
      siteConfig[`${key}_CN`] = baseConfig[key].replace(tldReg, mainTld);
      siteConfig[`${key}_COM`] = baseConfig[key].replace(tldReg, mainTld);
      if (isOffline) {
        if (siteConfig[key].indexOf('www') !== -1) {
          siteConfig[key] = siteConfig[key].replace('https://www.kucoin.net', location.origin);
        } else {
          siteConfig[key] = siteConfig[key].replace(/^(https:\/\/[^\.]+)\./, (_, $1) => `${$1}-${ng}.${env}.`);
        }
        if (key === 'PAY_PCI_HOST') {
          const PAY_PCI_HOST_OFFLINE = 'https://paypci.wlt-sit.kucoin.net';
          siteConfig[key] = PAY_PCI_HOST_OFFLINE;
          siteConfig[`${key}_CN`] = PAY_PCI_HOST_OFFLINE;
          siteConfig[`${key}_COM`] = PAY_PCI_HOST_OFFLINE;
        }
      }
    });
    // 当前的域名
    siteConfig.MAIN_HOST = window.location.origin;
    return siteConfig;
  }

  // 引导加载
  try {
    window._WEB_RELATION_ = loadScript();
  } catch (e) {
    console.log("BOOT RELATION ERR", e);
  }
})();
