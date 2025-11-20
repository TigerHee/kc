/**
 * Owner: brick.fan@kupotech.com
 *
 * 通过 url 和 app 的 ua 对比，看站点是否一致，如果不一致 * 则重定向到 app 的站点
 */

import { supportSites, userAgent } from "./config";
import { switchSiteWeb } from "./switchSite";

// 获取当前 APP 容器站点
const getAppSite = () => {
  const filterSites = supportSites.filter((site) => site !== "global");

  let appSite = "global";

  filterSites.forEach((site) => {
    if (userAgent.includes(`kucoin ${site.toLowerCase()}`)) {
      appSite = site;
    }
  });

  return appSite;
};

// 检查当前站点是否和 APP 容器匹配，如果不匹配，则前端自己重定向一次
const checkAppSiteMatch = () => {
  const appSite = getAppSite();
  if (window._BRAND_SITE_FULL_NAME_ !== appSite) {
    switchSiteWeb(appSite);
  }
};

export { checkAppSiteMatch, getAppSite };
