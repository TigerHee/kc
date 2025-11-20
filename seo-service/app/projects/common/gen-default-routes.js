/**
 * 通过 puppeteer 获取静态路由
 * Owner: hanx.wei@kupotech.com
 */
const wait = require('@utils/wait');
const logger = require('@app/worker/logger');

module.exports = async function() {
  try {
    await this.puppeteerManager.connect();
    const page = await this.puppeteerManager.getBrowserPage();

    await page.goto(`${this.host}${this.entry}`, {
      waitUntil: 'networkidle0',
      timeout: this.pageTimeout,
    });
    await wait(5);
    // 获取站点的所有注册路由, 并筛选出静态路由
    const result = await page.evaluate(() => {
      const staticRoutes = window.__KC_CRTS__
        .filter(v => v.path && v.path.indexOf(':') === -1)
        .map(v => v.path);
      return Promise.resolve(JSON.stringify(staticRoutes));
    });
    const staticRoutes = JSON.parse(result).filter(route => route !== '/404');
    await this.puppeteerManager.finish();
    return {
      routeSetName: 'default',
      withoutLang: staticRoutes,
      withLang: null,
    };
  } catch (err) {
    logger.error(`worker ${process.env.worker_index} gen routes error,  ${this.host}${this.entry}`, err);
    return {
      routeSetName: 'default',
      withoutLang: [],
      withLang: null,
    };
  }
};
