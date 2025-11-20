/**
 * 页面抓取生成
 * Owner: hanx.wei@kupotech.com
 */
const path = require('path');
const fse = require('fs-extra');
const wait = require('@utils/wait');
const { execSync } = require('@utils/exec');
const resolveWriteFileName = require('@utils/resolve-writefile-name');
const resolveJSSStyles = require('@utils/puppeteer/resolve-jss-styles');
const removeHeadPreloadedResources = require('@utils/puppeteer/remove-head-resources');
const moveBodyPreloadedResources = require('@utils/puppeteer/move-body-resources');
const handlePreloadedCSSLink = require('@utils/puppeteer/handle-preloaded-css-link');
const checkHTMLContent = require('@utils/puppeteer/check-html-content');
const logger = require('@app/worker/logger');

function genUrls(task, host, entry) {
  return task.routes.map(route => {
    if (task.routeSetName === 'routes') {
      // 指定路由不拼接 entry
      entry = '';
    }
    if (task.routeWithLangPrefix) {
      return `${host}${entry}${route}`;
    }
    return task.lang === 'en'
      ? `${host}${entry}${route}`
      : `${host}/${task.lang}${entry}${route}`;
  });
}

async function gotoPage(browserPage, currentUrl, pageTimeout, isMobile) {
  try {
    const res = await browserPage.goto(currentUrl, {
      waitUntil: 'networkidle0',
      timeout: pageTimeout,
    });
    const status = res.status();
    if (status !== 200 && status !== 304) {
      throw new Error(`Go to page response error, status ${status}`);
    }
  } catch (err) {
    logger.error(`page goto error ${currentUrl}, isMobile: ${isMobile}`, err);
    return err;
  }
}

async function visitUrl(
  browserPage,
  options,
  puppeteerManager,
  resolveUrlVisit,
  isMobile = false
) {
  const { currentUrl, task, projectConfig, cookieDomain } = options;
  logger.debug(
    `visit ${currentUrl}, theme: ${task.theme} isMobile: ${isMobile}`
  );
  // 设置 theme
  await browserPage.evaluateOnNewDocument(() => {
    window.localStorage.setItem('kc_theme', 'light');
  });
  await browserPage.setCookie({
    name: 'kc_theme',
    value: 'light',
    domain: cookieDomain,
    session: true,
  });
  const error = await gotoPage(
    browserPage,
    currentUrl,
    puppeteerManager.pageTimeout,
    isMobile
  );
  try {
    if (error) {
      // 访问失败的 url 直接 resolve 重试流程
      resolveUrlVisit(currentUrl, false);
      await browserPage.close();
      return;
    }
    const pageUrl = browserPage.url();
    // 排除那些重定向的页面，包括重定向到 404，登录等；这里保持旧服务的判断，理论上不会生成末尾带 / 的 url
    if (
      pageUrl !== currentUrl &&
      `${pageUrl}/` !== currentUrl && // 页面 url 和访问 url 不一致
      pageUrl !== encodeURI(currentUrl) &&
      `${pageUrl}/` !== encodeURI(currentUrl) // 页面 url 和 encode 之后的访问 url 也不一致
    ) {
      logger.debug(
        `url not match ${currentUrl} vs ${pageUrl}, ${encodeURI(currentUrl)}`
      );
      // 标记失败，不再重试
      resolveUrlVisit(currentUrl, false, false);
      await browserPage.close();
      return;
    }
    // 等待一段时间，保证页面稳定
    await wait(3.5);
    // 处理页面内容
    await resolvePageContent(browserPage, projectConfig, isMobile);
    // 生成文件
    let content = await browserPage.content();
    content = handlePreloadedCSSLink(content);
    if (checkHTMLContent(content) !== true) {
      throw new Error('HTML 内容检查有异常');
    }
    generateFile(currentUrl, task, content, projectConfig, isMobile);
    await browserPage.evaluate(() => {
      localStorage.clear();
    });
    resolveUrlVisit(currentUrl);
    await browserPage.close();
    return;
  } catch (err) {
    logger.error(`${currentUrl} generation error`, err);
    // 标记失败，不再重试
    resolveUrlVisit(currentUrl, false, false);
    await browserPage.close();
  }
}

async function resolvePageContent(browserPage, projectConfig, isMobile) {
  if (projectConfig.resolveContentConfig) {
    if (projectConfig.resolveContentConfig.removeHeadScriptPatterns) {
      await removeHeadPreloadedResources(
        browserPage,
        projectConfig.resolveContentConfig.removeHeadScriptPatterns
      );
    }
    if (projectConfig.resolveContentConfig.moveToBodyHeadScriptPatterns) {
      await moveBodyPreloadedResources(
        browserPage,
        projectConfig.resolveContentConfig.moveToBodyHeadScriptPatterns
      );
    }
  }
  // 最后处理 useSSG 注入
  await resolveJSSStyles(browserPage, { isMobile, theme: 'light' });
}

function generateFile(
  currentUrl,
  task,
  content,
  projectConfig,
  isMobile = false
) {
  const writeFileName = resolveWriteFileName(
    currentUrl,
    task,
    projectConfig,
    isMobile
  );
  fse.outputFileSync(writeFileName, content);
}

// url 访问失败重试次数
const URL_FAILED_RETRY_LIMIT = 2;
function resolveUrlVisit(failedUrlsMap, url, success = true, retry = true) {
  if (success) {
    failedUrlsMap.delete(url);
    return;
  }
  if (!retry) {
    // 直接失败的页面，不再重试
    failedUrlsMap.set(url, 0);
    return;
  }
  const triedCount = failedUrlsMap.get(url) || 0;
  if (triedCount < URL_FAILED_RETRY_LIMIT) {
    failedUrlsMap.set(url, triedCount + 1);
  } else {
    failedUrlsMap.set(url, 0);
  }
}
module.exports = async function(task) {
  const mobileGen = this.config.mobileGen;
  try {
    const urls = genUrls(task, this.host, this.entry);
    const total = urls.length;
    logger.info(
      `start gen pages, ${task.projectName}, lang: ${task.lang}, theme: ${task.theme}, ${task.routeSetName} routes, worker ${process.env.worker_index}, urls total: ${total}`
    );
    await this.puppeteerManager.connect();
    const failedUrlsMap = new Map();
    const failedMobileUrlsMap = new Map();
    while (urls.length !== 0) {
      if (this.stopFlag) break;
      if (mobileGen) {
        const currentUrl = urls.pop();
        const failedPcUrlCount = failedUrlsMap.get(currentUrl);
        const failedMobileUrlCount = failedMobileUrlsMap.get(currentUrl);
        if (failedPcUrlCount === 0) {
          // mobile
          const browserPages = await this.puppeteerManager.getBrowserPages(
            1,
            this.puppeteerManager.MOCK_ENV_MOBILE
          );
          await visitUrl(
            browserPages[0],
            {
              currentUrl,
              task,
              projectConfig: this.config,
              cookieDomain: this.cookieDomain,
            },
            this.puppeteerManager,
            resolveUrlVisit.bind(this, failedMobileUrlsMap),
            mobileGen
          );
        } else if (failedMobileUrlCount === 0) {
          // pc
          const browserPages = await this.puppeteerManager.getBrowserPages(
            1,
            this.puppeteerManager.MOCK_ENV_PC
          );
          await visitUrl(
            browserPages[0],
            {
              currentUrl,
              task,
              projectConfig: this.config,
              cookieDomain: this.cookieDomain,
            },
            this.puppeteerManager,
            resolveUrlVisit.bind(this, failedUrlsMap)
          );
        } else {
          // all
          const pcBrowserPages = await this.puppeteerManager.getBrowserPages(
            1,
            this.puppeteerManager.MOCK_ENV_PC
          );
          const mobileBrowserPages =
            await this.puppeteerManager.getBrowserPages(
              1,
              this.puppeteerManager.MOCK_ENV_MOBILE
            );
          await Promise.all([
            visitUrl(
              pcBrowserPages[0],
              {
                currentUrl,
                task,
                projectConfig: this.config,
                cookieDomain: this.cookieDomain,
              },
              this.puppeteerManager,
              resolveUrlVisit.bind(this, failedUrlsMap)
            ),
            visitUrl(
              mobileBrowserPages[0],
              {
                currentUrl,
                task,
                projectConfig: this.config,
                cookieDomain: this.cookieDomain,
              },
              this.puppeteerManager,
              resolveUrlVisit.bind(this, failedMobileUrlsMap),
              mobileGen
            ),
          ]);
        }
        // 重试, failedUrls 记录为非 0 次数
        if (
          failedUrlsMap.get(currentUrl) ||
          failedMobileUrlsMap.get(currentUrl)
        ) {
          urls.push(currentUrl);
        }
      } else {
        const browserPageCount = Math.min(
          urls.length,
          this.puppeteerManager.pageCount
        );
        const browserPages = await this.puppeteerManager.getBrowserPages(
          browserPageCount,
          this.puppeteerManager.MOCK_ENV_PC
        );
        const currentUrls = [];
        await Promise.all(
          browserPages.map(browserPage => {
            const currentUrl = urls.pop();
            currentUrls.push(currentUrl);
            return visitUrl(
              browserPage,
              {
                currentUrl,
                task,
                projectConfig: this.config,
                cookieDomain: this.cookieDomain,
              },
              this.puppeteerManager,
              resolveUrlVisit.bind(this, failedUrlsMap)
            );
          })
        );
        // 重试, failedUrls 记录为非 0 次数
        currentUrls.forEach(currentUrl => {
          if (failedUrlsMap.get(currentUrl)) {
            urls.push(currentUrl);
          }
        });
      }
      logger.info(
        `${task.projectName}, lang: ${task.lang}, theme: ${task.theme}, ${task.routeSetName} routes, worker ${process.env.worker_index}, urls left: ${urls.length}`
      );
    }
    if (this.stopFlag) {
      await this.puppeteerManager.finish();
      logger.info(
        `${task.projectName}, lang: ${task.lang}, theme: ${task.theme}, ${task.routeSetName} routes, worker ${process.env.worker_index} stop done`
      );
      return;
    }
    // 复制文件
    const projectThemeDistConfig = this.config.distConfig[task.theme];
    const tempDistPath = `${projectThemeDistConfig.projectTempDistPath}/${task.lang}/${task.taskId}`;
    if (fse.existsSync(tempDistPath)) {
      const targetCopyPath =
        task.lang === 'en'
          ? projectThemeDistConfig.projectDistCopyPath
          : path.join(projectThemeDistConfig.projectDistCopyPath, task.lang);
      fse.ensureDirSync(targetCopyPath);
      const copyResult = execSync(
        `rsync -aqv ${tempDistPath}/* ${targetCopyPath}/`
      );
      if (copyResult.err) {
        logger.error('copy file error', copyResult.err);
        if (copyResult.stderr) {
          logger.error(copyResult.stderr.toString());
        }
      }
    }
    // mobile copy
    if (mobileGen) {
      const mobileTempDistPath = `${projectThemeDistConfig.projectMobileTempDistPath}/${task.lang}/${task.taskId}`;
      if (fse.existsSync(mobileTempDistPath)) {
        const targetCopyPath =
          task.lang === 'en'
            ? projectThemeDistConfig.projectMobileDistCopyPath
            : path.join(
              projectThemeDistConfig.projectMobileDistCopyPath,
              task.lang
            );
        const copyResult = execSync(
          `rsync -aqv ${mobileTempDistPath}/* ${targetCopyPath}/`
        );
        if (copyResult.err) {
          logger.error('copy file error', copyResult.err);
          if (copyResult.stderr) {
            logger.error(copyResult.stderr.toString());
          }
        }
      }
    }

    logger.debug(`${task.taskId} done`);
    await this.puppeteerManager.finish();
    const failedUrls = new Set();
    for (const failedUrl of failedUrlsMap.keys()) {
      failedUrls.add(failedUrl);
    }
    if (mobileGen) {
      for (const failedUrl of failedMobileUrlsMap.keys()) {
        failedUrls.add(failedUrl);
      }
    }
    return { task, error: null, total, failedUrls: Array.from(failedUrls) };
  } catch (err) {
    logger.error(`worker ${process.env.worker_index} run task error`, err);
    return { task, error: err };
  }
};
