/*
 * @Owner: Melon@kupotech.com
 * @Author: Melon Melon@kupotech.com
 * @Date: 2025-05-08 15:00:35
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-06-16 11:48:10
 * @FilePath: /g-biz/packages/share/src/utils/shareHost.js
 * @Description: 获取站点分享基础域名链接
 */

/**
 * 获取站点分享基础域名链接，已经适配了多租户和共享站； 共享站点会带上 /en-au 或 /en-eu
 * -传递useProHost为false时，返回域名跟随环境，举例：
 *   例 主站 ng-01 sit环境 返回 https://nginx-web-01.sit.kucoin.net
 *   例 土耳其站 ng-01 sit环境 返回 https://site-01.tr.sit.kucoin.net
 *   例 泰国站 ng-01 sit环境 返回 https://site-01.th.sit.kucoin.net
 *   例 欧洲站 ng-01 sit环境 返回 https://nginx-web-01.sit.kucoin.net/en-eu
 * -传递useProHost为true时，返回线上的域名host，举例
 *   例 主站 ng-01 sit环境 返回 https://www.kucoin.com
 *   例 土耳其站 ng-01 sit环境 返回 https://www.kucoin.tr
 *   例 泰国站 ng-01 sit环境 返回 https://www.kucoin.th
 *   例 欧洲站 ng-01 返回 https://www.kucoin.com/en-eu
 * Tips App内如果为了规避出现.plus域名，可以传递 { isUseProHost: isPro }, 目前只有线上环境/预发布会app内会使用.plus域名。 所以isPro取值为是否是线上环境就可以了。
 * @param {object} prop
 * @param {boolean} prop.isUseProHost 是否强制使用线上.com域名,传递为true时强制使用线上的.com域名host; 有的业务场景会使用到，比如限时返佣的邀请链接或App内不要暴露.plus域名，会固定展示成.com域名
 */
export const getShareBaseUrl = (prop = {}) => {
  const { isUseProHost } = prop;
  let host;
  if (isUseProHost) {
    host = window._WEB_RELATION_?.MAINSITE_HOST_COM || window._WEB_RELATION_?.MAIN_HOST_COM;
  } else {
    host = window._WEB_RELATION_?.MAINSITE_HOST;
  }
  if (window._DEFAULT_PATH_) {
    host = `${host}/${window._DEFAULT_PATH_}`;
  }
  return host;
};

/**
 * 分享域名+pathname。包含多租户逻辑 需要注意的是分享域名取的是boot.js返回的域名，共享站不会带上 /en-au 或 /en-eu，需要pathname带上
 * @param {*} prop.isUseProHost 是否强制使用线上.com域名,传递为true时强制使用线上的.com域名host; 有的业务场景会使用到，比如限时返佣的邀请链接或App内不要暴露.plus域名，会固定展示成.com域名
 * @param {*} prop.pathname 页面路径pathname
 * @returns
 */
export const getShareUrl = (prop) => {
  const { isUseProHost, pathname } = prop || {};
  let host;
  if (isUseProHost) {
    host = window._WEB_RELATION_?.MAINSITE_HOST_COM || window._WEB_RELATION_?.MAIN_HOST_COM;
  } else {
    host = window._WEB_RELATION_?.MAINSITE_HOST;
  }
  return host + pathname;
};
