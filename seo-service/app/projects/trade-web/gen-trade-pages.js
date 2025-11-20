/**
 * Owner: Chelsey.Fan@kupotech.com
 */

const path = require('path');
const isUsefulHtml = require('@utils/is-useful-html');
const {
  EmptyLang,
  langHandle,
  defLangToEmpty,
  getUrlPath,
  reg,
} = require('./constants');
const { getTDK, resolveOgTDK } = require('./seo');
const { hreflangConfName } = require('./seo/middleware');
const fetch = require('isomorphic-fetch');
const logger = require('./trade-web-logger');
const fse = require('fs-extra');
const { execSync } = require('@utils/exec');
const concurrencyHandle = require('@utils/concurrency-handle');
// 模板集合
/**
 * params:
 *  taskId,
    projectName,
    lang,
    routes,
    routeWithLangPrefix,
 */
// 模板集合
let Tmpls_map = {};
async function main(task, config) {
  Tmpls_map = {};
  const { siteUrl } = config;
  const urls = task.routes;
  const total = urls.length;
  const { routeWithLangPrefix } = task;
  const lang = task.lang;
  const failedUrlsMap = new Map();
  // url 访问失败重试次数
  const URL_FAILED_RETRY_LIMIT = 2;
  const resolveUrlVisit = (url, success = true, retry = true) => {
    if (success) {
      failedUrlsMap.delete(url.pathname);
      return;
    }
    if (!retry) {
      failedUrlsMap.set(url.pathname, 0);
      return;
    }
    const triedCount = failedUrlsMap.get(url) || 0;
    if (triedCount < URL_FAILED_RETRY_LIMIT) {
      urls.push(url);
      failedUrlsMap.set(url.pathname, triedCount + 1);
    }
  };
  logger.info(
    `start gen pages, ${task.projectName}, lang: ${task.lang}, ${task.routeSetName} routes, urls total: ${total}`
  );

  await concurrencyHandle(urls, urlInfo => {
    const params = urlInfo?.split('/').filter(i => i);
    const pathname = routeWithLangPrefix
      ? lang === 'en'
        ? urlInfo.replace(reg, '')
        : urlInfo
      : `${getUrlPath(defLangToEmpty(lang))}${urlInfo}`;
    const _urlInfo = {
      url: `${siteUrl.origin}${pathname}`,
      pathname,
      code: params[params.length - 1],
      lang,
    };
    async function callback(_urlInfo, config) {
      const status = await createPageFromTpl(_urlInfo, config, task);
      resolveUrlVisit(_urlInfo, status, false);
    }
    return callback(_urlInfo, config);
  });

  if (this.stopFlag) {
    logger.info(
      `trade-web, lang: ${task.lang}, ${task.routeSetName} routes, worker ${process.env.worker_index} stop done`
    );
    return;
  }

  copyFile(config, task);
  const failedUrls = [];
  for (const failedUrl of failedUrlsMap.keys()) {
    failedUrls.push(failedUrl);
  }

  return { task, error: null, total, failedUrls };
}

async function getPageTplHandle(url, memoKey, retryTime = 5, count = 0) {
  if (Tmpls_map[memoKey]) {
    return Tmpls_map[memoKey];
  }
  let response,
    pageText = '';
  try {
    response = await fetch(url);
    pageText = await response.text();
  } catch (error) {
    logger.debug('请求页面文本内容失败');
  }
  // 避免同时发请求时，其他异步请求已存在异步请求的缓存内容，只使用第一次满足条件的缓存内容，保证一致性
  if (Tmpls_map[memoKey]) {
    return Tmpls_map[memoKey];
  }
  if (!isUsefulHtml(pageText)) {
    // 至少重试2次
    if (count <= Math.max(retryTime, 2)) {
      return getPageTplHandle(url, memoKey, retryTime, count + 1);
    }
  } else {
    Tmpls_map[memoKey] = resolveOgTDK(pageText);
  }
  return Tmpls_map[memoKey];
}

function getPageTpl(url, memoKey, maxRetry = 2) {
  return getPageTplHandle(url, memoKey, maxRetry);
}

function generateFile(filepath, content) {
  fse.outputFileSync(filepath, content);
}
function copyFile(config, task) {
  // 复制文件
  const targetCopyPath =
    task.lang === 'en'
      ? config.distConfig[task.theme].projectDistCopyPath
      : path.join(config.distConfig[task.theme].projectDistCopyPath, task.lang);
  fse.ensureDirSync(targetCopyPath);
  const copyResult = execSync(
    `rsync -aqv ${config.distConfig[task.theme].projectTempDistPath}/${
      task.lang
    }/${task.taskId}/* ${targetCopyPath}/`
  );
  if (copyResult.err) {
    logger.error('copy file error', copyResult.err);
    if (copyResult.stderr) {
      logger.error(copyResult.stderr.toString());
    }
  }
  logger.debug(`${task.taskId} done`);
  // 复制 BTC-USDT 到 trade 根目录，为了让www.kucoin.com/trade 有 BTC-USDT的 html ssg产物
  const copyBTCUSDTResult = execSync(
    `rsync -aqv ${targetCopyPath}/trade/BTC-USDT/index.html ${targetCopyPath}/trade/index.html`
  );
  if (copyBTCUSDTResult.err) {
    logger.error('copyBTCUSDTResult file error', copyBTCUSDTResult.err);
    if (copyBTCUSDTResult.stderr) {
      logger.error(copyBTCUSDTResult.stderr.toString());
    }
  }
}

/**
 *
 * 根据模版生成页面
 *
 * @param {{url: string, code: string, lang: string, pathname, langs: string[] }}  urlInfo  当前页面的完整地址
 * @param {{ entry, siteUrl }} entry 缓存key
 * @param config
 */
async function createPageFromTpl(urlInfo, config, task) {
  const { entry: memoKey, siteUrl, langs, distConfig, supportLangs } = config;
  const allLangs =
    Array.isArray(supportLangs) && supportLangs.length
      ? supportLangs
      : langs.newLangs;
  const { pathname, code, lang = 'en' } = urlInfo;
  let tdk = null;
  let status = false;
  let rslt = '';
  let tlpFn;
  try {
    tdk = await getTDK(urlInfo, siteUrl); // head标签里面的title meta等
  } catch (error) {
    logger.debug(`${pathname} get tdk failed`);
  }
  if (!tdk) {
    return;
  }
  try {
    tlpFn = await getPageTpl(urlInfo.url, memoKey);
  } catch (error) {
    logger.debug(`${urlInfo.url}获取替换内容方法失败`);
  }
  if (typeof tlpFn !== 'function') return;
  // 获取url
  const getUrl = lang => {
    const _pathname = `${getUrlPath(
      defLangToEmpty(lang)
    )}${memoKey}${getUrlPath(code)}`;
    return `${siteUrl.origin}${_pathname}`;
  };

  try {
    // 替换内容
    rslt = await tlpFn(tdk, {
      ...urlInfo,
      allLangs,
      [hreflangConfName]: {
        urls: allLangs.map(lang => ({
          url: getUrl(langHandle(lang)),
          lang,
        })),
        defaultUrl: {
          url: getUrl(EmptyLang),
          lang: EmptyLang,
        },
      },
    });
  } catch (error) {
    logger.debug(`${pathname} replace content failed`);
  }

  // pathname 的路径跟文件路径一致
  const _path = `/${lang}/${task.taskId}/${memoKey}/${code}`;
  const fd = path.join(distConfig[task.theme].projectTempDistPath, _path);
  const filePath = `${fd}/index.html`;
  generateFile(filePath, rslt);
  status = true;
  return status;
}

module.exports = main;
