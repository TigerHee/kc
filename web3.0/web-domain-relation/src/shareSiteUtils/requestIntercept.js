/**
 * Owner: brick.fan@kupotech.com
 *
 * 1. 拦截所有请求，带上 x-site 请求头
 * 2. 拦截所有响应，如果 code 为 308100，则跳转到目标站点；
 * 3. 如果是用户操作中途才返回的 308100，则弹窗提示用户 KYC 地址变化；
 */

import { isInApp, SITE_NOT_MATCH_CODE, supportSites } from "./config";
import { getIsSiteReady } from "./getUserSite";
import { onKYCSiteChange } from "./kycRedirectSubscribe";
import { switchSiteWeb, switchSiteApp } from "./switchSite";

function getRootDomain(hostname) {
  const parts = hostname.split(".");
  return parts.slice(-2).join(".");
}

// url 是否是同源的
function isSameOrigin(url) {
  if (!url.startsWith("http")) {
    return true;
  }

  // 如果 url 的根域名和当前域名相同，则认为是同源；比如 a.kucoin.com 和 b.kucoin.com 是同源的
  const urlObj = new URL(url);
  const urlHost = urlObj.host;
  const urlRootDomain = getRootDomain(urlHost);

  const currentHost = location.host;
  const currentRootDomain = getRootDomain(currentHost);

  return urlRootDomain === currentRootDomain;
}

function handleSiteNotMatch(site) {
  if (!supportSites.includes(site)) {
    console.error(`Request return site ${site} is not supported`);
    return;
  }

  if (isInApp) {
    // 如果是 app 内部，则直接调用 app 的方法
    switchSiteApp(site);
  } else {
    // 用户使用过程中，出现了异常，则认为是 KYC 地址变化导致的
    if (getIsSiteReady()) {
      onKYCSiteChange(site);
    } else {
      // 站点还没请求好，其它接口报错了，则直接跳转
      switchSiteWeb(site);
    }
  }
}

function interceptFetchRequests(site) {
  const originalFetch = window.fetch;
  window.fetch = async function (input, init = {}) {
    const url = input?.url || input?.href || input || "";
    // 只处理同源请求
    if (isSameOrigin(url)) {
      init.headers = new Headers(init.headers || {});
      init.headers.set("x-site", site);
      const response = await originalFetch(input, init);
      try {
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();
        if (data?.code === SITE_NOT_MATCH_CODE) {
          handleSiteNotMatch(data?.data?.siteType);
        }
      } catch (e) {}
      return response;
    } else {
      return originalFetch(input, init);
    }
  };
}

function interceptXHRRequests(site) {
  const originalXHR = window.XMLHttpRequest;

  function CustomXHR() {
    const xhr = new originalXHR();

    const originalOpen = xhr.open;
    xhr.open = function (originMethod, url) {
      this._requestURL = url;
      originalOpen.apply(xhr, arguments);
    };

    const originalSend = xhr.send;
    xhr.send = function () {
      // 如果是同源请求，则带上 x-site 请求头
      if (isSameOrigin(this._requestURL)) {
        this.setRequestHeader("x-site", site);
      }
      originalSend.apply(xhr, arguments);
    };

    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4) {
        try {
          if (isSameOrigin(this._requestURL)) {
            const json = JSON.parse(xhr.response);
            if (json?.code === SITE_NOT_MATCH_CODE) {
              handleSiteNotMatch(json?.data?.siteType);
            }
          }
        } catch (e) {}
      }
    });
    return xhr;
  }
  CustomXHR.prototype = originalXHR.prototype;
  window.XMLHttpRequest = CustomXHR;
}

const requestIntercept = () => {
  interceptFetchRequests(window._BRAND_SITE_FULL_NAME_);
  interceptXHRRequests(window._BRAND_SITE_FULL_NAME_);
};

export { requestIntercept };
