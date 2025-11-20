/**
 * Owner: hanx.wei@kupotech.com
 */
const BaseProjectHandler = require('../common/base');
const genDefaultRoutes = require('./gen-default-routes');
const genPriceRoutes = require('./gen-price-routes');
const logger = require('@app/worker/logger');
const startServerlessJob = require('../common/serverless-gen');
class PublicHandler extends BaseProjectHandler {
  constructor(configs, puppeteerManager, messenger) {
    super(configs, puppeteerManager, messenger);
    this.config = configs.projectConfigs['seo-price-web'];
    this.entry = this.config.entry;
  }

  /**
   * currentRoutes = {
   *    withoutLang: [],
   *    withLang: null | { [lang]: [] },
   * }
   */
  async genRoutes(params) {
    const routes = [];
    const serverlessRoutes = [];
    for (const routeSet of params.routeSets) {
      let currentRoutes;
      switch (routeSet) {
        case 'default':
          currentRoutes = await genDefaultRoutes.call(this);
          break;
        case 'price':
          currentRoutes = await genPriceRoutes.call(this);
          break;
        default:
          break;
      }
      if (currentRoutes) {
        if (currentRoutes.useServerless) {
          serverlessRoutes.push(currentRoutes);
        } else {
          routes.push(currentRoutes);
        }
      }
      // logger.debug('gened routes', routes);
      if (this.stopFlag) {
        this.stopFlag = false;
        logger.debug(`worker ${process.env.worker_index} send stopped message`);
        return this.resolveResult('worker-handler-stopped');
      }
    }
    for (const routesInfo of serverlessRoutes) {
      if (this.checkStopFlag()) {
        return this.resolveResult('worker-handler-stopped');
      }
      await startServerlessJob.call(
        this,
        params.langs,
        routesInfo,
        params.lambdaOptions
      );
    }
    if (this.configs.isDev && this.configs.USE_SERVERLESS) {
      // 本地 serverless 触发不跑其他的
      return this.resolveResult('routes-gen', { routes: [] });
    }
    return this.resolveResult('routes-gen', { routes });
  }
}

module.exports = PublicHandler;
