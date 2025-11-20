/**
 * Owner: Chelsey.Fan@kupotech.com
 */
const { newToOld } = require('@scripts/langs/new');
const request = require('@utils/request');
const { wait } = require('@utils/wait');
const { allMiddleWare } = require('./middleware');
const getNotBrandTitle = require('@utils/get-not-brand-title');
const logger = require('@app/master/logger');
// const configs = require('@scripts/config');
/**
 * TDK 接口地址
 */
const tdk_url = '/_api/seo-support/tdk/queryTdk';

/**
 * TDK 获取的信息
 * @typedef {Parameters<allMiddleWare[0]>[0]} TDKInfoType
 */

/**
 * url 相关的参数信息
 * @typedef {{url: string, code: string, lang: string, pathname: string}} UrlInfoType
 */

/**
 * loading_lcp dom 结构，为了提升 lcp 评分
 */
const insertLoadingMiddleware = () => {
  return `
    <div id="loading_lcp" class="loading-lcp-e2eb6a85de39a3d76e5d"><div class="loading-center-e2eb6a85de39a3d76e5d"><div class="loading-center-absolute-e2eb6a85de39a3d76e5d"><img id="loading_lcp_img" width="200" height="200" src="https://assets.staticimg.com/static/image/web_trade_loading.png" alt="kucoin loading"></div></div></div>
  `;
};

/**
 * 获取TDK的内容
 * @param { UrlInfoType } urlInfo
 * @param { Location } siteUrl
 * @param { number } retryTime
 * @param { number } [count]
 * @return { undefined | TDKInfoType }
 */
async function getTDKHandle(urlInfo, siteUrl, retryTime, count = 0) {
  const { lang, pathname, url } = urlInfo;
  const { origin, hostname } = siteUrl;

  // if (configs.isDev) {
  //   origin = 'https://www.kucoin.com';
  //   hostname = 'www.kucoin.com';
  // }

  if (!pathname) return;
  const reqUrl = `${origin}${tdk_url}?domainName=${hostname}&path=${encodeURIComponent(
    pathname
  )}&language=${newToOld[lang || 'en']}`;
  let res;
  try {
    res = await request(reqUrl);
  } catch (e) {
    if (count > Math.max(retryTime || 0, 2)) return undefined;
    logger.debug(`get tdk failed, try after 500 ms, ${count} times: ${reqUrl}`);
    await wait(500);
    await getTDKHandle(urlInfo, siteUrl, retryTime, count + 1);
  }
  const data = res ? res.data : res;
  if (!data || Object.keys(data).length < 3) {
    logger.debug(
      `${url} lack information, tdk api ${reqUrl} : ${JSON.stringify(data)}`
    );
    return undefined;
  }
  return data;
}

/**
 * 获取TDK的内容
 * @param { UrlInfoType } urlInfo
 * @param { Location } siteUrl
 * @param { number } [retryTime]
 * @return { undefined | TDKInfoType }
 */
async function getTDK(urlInfo, siteUrl, retryTime = 2) {
  return await getTDKHandle(urlInfo, siteUrl, retryTime);
}

/**
 * 处理seo插入位置, seoTag 页面插入位置 <!--seoTag-->
 * @param {string} pageText
 * @param {{ seoTag?: string }} [conf]
 */
const resolveOgTDK = (pageText, conf = {}) => {
  const { seoTag } = conf;
  let left,
    right;
  let hasPosition = false;
  let hasOgTitle = false;
  let splitTagHandle = () => '';
  // 第一优先级：具有分隔符
  if (seoTag) {
    [left, right] = pageText.split(`<!--${seoTag}-->`);
    hasPosition = !!right;
  }
  // 第二优先级 具有og:title的meta标签
  if (!hasPosition) {
    [left, right] = pageText.split(/property="og:title".*?\/?>/);
    hasPosition = !!right;
    if (hasPosition) {
      hasOgTitle = hasPosition;
      splitTagHandle = ({ title }) =>
        `property="og:title" content="${getNotBrandTitle(title)}" \>`;
    }
  }
  // 兜底逻辑以<head>作为分隔符
  if (!hasPosition) {
    [left, right] = pageText.split('<head>');
    splitTagHandle = () => '<head>';
  }
  // 去除重复的 tdk 标签
  right = right
    .replace(
      /<meta\s+name=['"]description['"]\s+content=['"]([^'"]*)['"]\s*\/?>/,
      ''
    )
    .replace(
      /<meta\s+name=['"]keywords['"]\s+content=['"]([^'"]*)['"]\s*\/?>/,
      ''
    )
    .replace(/<title>(.*?)<\/title>/, '');
  /**
   * 处理数据
   * @template {Record<string|number, any> & { url: string, code: string, lang: string}} T
   * @param {TDKInfoType} tdkInfo
   * @param {T & {
   *  middleWareList?: (tdkInfo: TDKInfoType, conf: T, middleConf: {
   *  hasOgTitle: boolean
   * }) => string)[]
   * }} [conf] 其他配置, 默认使用全部中间件
   */

  // 找到<div id="root"></div>元素并在其旁边插入.loading元素
  const rootIndex = right.indexOf('<div id="root"></div>');
  if (rootIndex !== -1) {
    const beforeRoot = right.substring(0, rootIndex);
    const afterRoot = right.substring(rootIndex);
    right = `${beforeRoot}${insertLoadingMiddleware()}${afterRoot}`;
  }

  const handle = async (tdkInfo, conf = {}) => {
    const middleWareList = conf.middleWareList || allMiddleWare;
    let str = '';
    const list =
      (middleWareList || []).filter(fn => typeof fn === 'function') || [];
    for (const fn of list) {
      try {
        str += (await fn(tdkInfo, conf, { hasOgTitle })) || '';
      } catch (error) {
        logger.error('resolveOgTDK出错了');
      }
    }
    // 不能删除改变<!--powered_by_ssg-->
    return `${left}${splitTagHandle(tdkInfo)}
    <!--powered_by_ssg-->
    ${str}
    ${right}`;
  };
  return handle;
};

module.exports = {
  getTDK,
  resolveOgTDK,
};
