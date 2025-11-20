/**
 * Owner: brick.fan@kupotech.com
 *
 * 在 PC 且为主站没有语言参数时，跳转到上一次访问的站点
 */

import { LAST_VISIT_SITE_KEY, supportSites } from "./config";
import { switchSite } from "./switchSite";

// 主站如果没有语言参数，则跳转到上一次访问的站点；只有主站英语才符合条件
const goLastSiteIfNoLocale = () => {
  try {
    // 如果不是 KC 站点，则不需要处理；
    if (window._BRAND_SITE_FULL_NAME_ !== "global") {
      return;
    }
    const lastSite = localStorage.getItem(LAST_VISIT_SITE_KEY);

    // 如果没有上一次访问的站点，或者上一次访问的站点是 KC，或者上一次访问的站点不是支持的站点，则不处理
    if (
      !lastSite ||
      lastSite === window._BRAND_SITE_FULL_NAME_ ||
      !supportSites.includes(lastSite)
    ) {
      return;
    }

    let hasLocaleInPath = false;
    // 检查 url 第一个路径是否是语言
    const pathArr = location.pathname.split("/").filter(Boolean);
    if (pathArr.length > 0) {
      const firstFragment = pathArr[0];
      if (window.__KC_LANGUAGES_BASE_MAP__.baseToLang[firstFragment]) {
        hasLocaleInPath = true;
      }
    }

    // 如果没有语言参数，则跳转到上一次访问的站点
    if (!hasLocaleInPath) {
      switchSite(lastSite);
    }
  } catch (e) {
    console.error("goLastSiteIfNoLocale error", e);
  }
};

export { goLastSiteIfNoLocale };
