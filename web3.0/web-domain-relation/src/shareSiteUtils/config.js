/**
 * Owner: brick.fan@kupotech.com
 */

const userAgent = window.navigator.userAgent.toLocaleLowerCase();
const isInApp = userAgent.includes("kucoin");

const SITE_NOT_MATCH_CODE = "308100";

const LAST_VISIT_SITE_KEY = "LAST_VISIT_SITE";

const isIOS = () => {
  return /(iPhone|iPad|iPod|iOS)/i.test(userAgent);
};

const shareSiteConfig = {
  global: {
    defaultLang: "en_US",
    defaultLocale: "en",
    baseCurrency: "USDT",
    defaultPath: "",
  },
  australia: {
    defaultLang: "",
    defaultLocale: "",
    baseCurrency: "USDT",
    defaultPath: "en-au",
  },
  europe: {
    defaultLang: "",
    defaultLocale: "",
    baseCurrency: "USDC",
    defaultPath: "en-eu",
  },
  demo: {
    defaultLang: "",
    defaultLocale: "",
    baseCurrency: "USDT",
    defaultPath: "en-demo",
  },
};

const supportSites = Object.keys(shareSiteConfig);

export {
  userAgent,
  LAST_VISIT_SITE_KEY,
  isIOS,
  shareSiteConfig,
  supportSites,
  isInApp,
  SITE_NOT_MATCH_CODE,
};
