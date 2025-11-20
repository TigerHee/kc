/**
 * Owner: ella.wang@kupotech.com
 */
const BaseProjectHandler = require('../common/base');
const genSupportRoutes = require('./gen-support-routes');
const startServerlessJob = require('../common/serverless-gen');
const logger = require('@app/worker/logger');
class PublicHandler extends BaseProjectHandler {
  constructor(configs, puppeteerManager, messenger) {
    super(configs, puppeteerManager, messenger);
    this.config = configs.projectConfigs['customer-web'];
    this.entry = this.config.entry;
  }

  async genRoutes(params) {
    const routes = [];
    const serverlessRoutes = [];

    for (const routeSet of params.routeSets) {
      let currentRoutes;
      switch (routeSet) {
        case 'support':
          currentRoutes = await genSupportRoutes.call(this, params.langs);
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
      // 路由触发serverless ssg
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
