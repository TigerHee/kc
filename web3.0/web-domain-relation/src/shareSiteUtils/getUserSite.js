/**
 * Owner: brick.fan@kupotech.com
 *
 * 通过接口读取用户应该归属的站点
 * 如果 forceRedirect 为 true，则代表登录了，直接重定向到用户应该归属的站点
 * 如果 forceRedirect 为 false，则代表没有登录，弹窗提示
 */

import { switchSite } from "./switchSite";
import { onIPSiteChange } from "./ipRedirectSubscribe";
import { supportSites } from "./config";

let IS_SITE_READY = false;
const getIsSiteReady = () => {
  return IS_SITE_READY;
};

// 读取用户应该归属的站点
const getUserSite = async () => {
  try {
    const response = await fetch("/_api/site-type");
    const data = await response.json();

    // const data = await new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({
    //       forceRedirect: false,
    //       siteType: "australia",
    //     });
    //   }, 1);
    // });

    const { forceRedirect, siteType } = data?.data || {};
    IS_SITE_READY = true;
    if (
      siteType &&
      supportSites.includes(siteType) &&
      siteType !== window._BRAND_SITE_FULL_NAME_
    ) {
      // 用户登录了，如果站点不一致，则重定向
      if (forceRedirect) {
        switchSite(siteType);
      } else {
        // 用户没有登录，站点不一致，则弹窗提示
        onIPSiteChange(siteType);
      }
    }
  } catch (e) {
    console.error("getUserSite error", e);
  }
};

export { getIsSiteReady, getUserSite };
