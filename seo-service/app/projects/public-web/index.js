/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-26 18:11:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-24 15:20:47
 * @FilePath: /seo-service/app/projects/public-web/index.js
 * @Description:
 */
/**
 * Owner: hanx.wei@kupotech.com
 */
const BaseProjectHandler = require('../common/base');
const genDefaultRoutes = require('./gen-default-routes');
const genAppDefaultRoutes = require('./gen-app-default-routes');
const genPreMarketRoutes = require('./gen-pre-market-routes');
const genAppPreMarketRoutes = require('./gen-app-pre-market-routes');
const genGemslotDetailsRoutes = require('./gen-gemslot-details-routes');
const genAppGemslotDetailsRoutes = require('./gen-app-gemslot-details-routes');
const genGemPoolDetailRoutes = require('./gen-gempool-detail-routes');
const genAppGemPoolDetailRoutes = require('./gen-app-gempool-detail-routes');
const logger = require('@app/worker/logger');
const startServerlessJob = require('../common/serverless-gen');
class PublicHandler extends BaseProjectHandler {
  constructor(configs, puppeteerManager, messenger) {
    super(configs, puppeteerManager, messenger);
    this.config = configs.projectConfigs['public-web'];
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
        case 'app-default':
          currentRoutes = await genAppDefaultRoutes.call(this);
          break;
        case 'pre-market':
          currentRoutes = await genPreMarketRoutes.call(this);
          break;
        case 'app-pre-market':
          currentRoutes = await genAppPreMarketRoutes.call(this);
          break;
        case 'gemslot-details':
          currentRoutes = await genGemslotDetailsRoutes.call(this);
          break;
        case 'app-gemslot-details':
          currentRoutes = await genAppGemslotDetailsRoutes.call(this);
          break;
        case 'gempool-detail':
          currentRoutes = await genGemPoolDetailRoutes.call(this);
          break;
        case 'app-gempool-detail':
          currentRoutes = await genAppGemPoolDetailRoutes.call(this);
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
