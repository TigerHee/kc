/**
 * Owner: brick.fan@kupotech.com
 */

import {
  LAST_VISIT_SITE_KEY,
  isInApp,
  isIOS,
  shareSiteConfig,
  supportSites,
} from "./config";

const switchSiteApp = (site = "") => {
  if (!supportSites.includes(site)) {
    console.error(`Site ${site} is not supported`);
    return;
  }
  try {
    const msg = JSON.stringify({
      type: "func",
      params: {
        name: "startChangeSite",
        siteType: site,
      },
    });
    if (isIOS()) {
      window.prompt(msg);
    } else {
      window.KuCoin.prompt(msg);
    }
  } catch (e) {
    console.error(e);
  }
};

// 切换后默认进入英语
const switchSiteWeb = (site = "") => {
  if (!supportSites.includes(site)) {
    console.error(`Site ${site} is not supported`);
    return;
  }

  localStorage.setItem(LAST_VISIT_SITE_KEY, site);

  // 当前站点
  const currentSite = window._BRAND_SITE_FULL_NAME_;
  const pathname = location.pathname;
  const search = location.search;
  const pathArr = pathname.split("/").filter(Boolean);

  // -----解析当前 url-----

  //解析出来当前 url 的 pathname
  let currentPathname = pathArr.join("/");

  // 如果当前是主站
  if (currentSite === "global") {
    // 看第一个路径是否是 locale
    let firstFragment = pathArr[0];
    if (window.__KC_LANGUAGES_BASE_MAP__.baseToLang[firstFragment]) {
      currentPathname = pathArr.slice(1).join("/");
    }
  } else {
    // 如果当前是共享站，则第一个路径一定为 locale
    currentPathname = pathArr.slice(1).join("/");
  }

  // -----开始生成目标 url-----

  const defaultPath = shareSiteConfig[site].defaultPath;

  const targetUrl = `${
    defaultPath === "" ? "" : `/${defaultPath}`
  }/${currentPathname}${search}`;

  window.location.href = targetUrl;
};

const switchSite = (site = "") => {
  if (isInApp) {
    switchSiteApp(site);
  } else {
    switchSiteWeb(site);
  }
};

export { switchSite, switchSiteWeb, switchSiteApp };
