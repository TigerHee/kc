/*
 * @Owner: elliott.su@kupotech.com
 */
const BaseProjectHandler = require('../common/base');
const genDefaultRoutes = require('./gen-default-routes');
const startServerlessJob = require('../common/serverless-gen');

class TradePublicHandler extends BaseProjectHandler {
  constructor(configs, puppeteerManager, messenger) {
    super(configs, puppeteerManager, messenger);
    this.config = configs.projectConfigs['professional-web'];
    this.entry = this.config.entry;
  }

  async genRoutes(params) {
    const routes = [];
    const serverlessRoutes = [];
    for (const routeSet of params.routeSets) {
      let currentRoutes;
      switch (routeSet) {
        case 'default':
          currentRoutes = await genDefaultRoutes.call(this);
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
      if (this.checkStopFlag()) {
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
    // 全部由 serverless 生成，则 routes 为 []
    return this.resolveResult('routes-gen', { routes });
  }
}

module.exports = TradePublicHandler;
