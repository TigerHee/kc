/**
 * Owner: will.wang@kupotech.com
 */
const BaseProjectHandler = require('../common/base');
const logger = require('@app/worker/logger');
const genRoutes = require('./gen-routes');

class KumexProHandler extends BaseProjectHandler {
  constructor(configs, puppeteerManager, messenger) {
    super(configs, puppeteerManager, messenger);
    this.config = configs.projectConfigs['kumex-pro'];
    this.entry = this.config.entry;
  }

  async genRoutes(params) {
    const routes = [];

    for (const routeSet of params.routeSets) {
      let currentRoute;

      switch (routeSet) {
        case 'default':
          currentRoute = await genRoutes.call(this);
          break;
        default:
          break;
      }

      if (currentRoute) {
        routes.push(currentRoute);
      }

      if (this.stopFlag) {
        this.stopFlag = false;
        logger.debug(`worker ${process.env.worker_index} send stopped message`);
        return this.resolveResult('worker-handler-stopped');
      }
    }

    if (this.configs.isDev && this.configs.USE_SERVERLESS) {
      // 本地 serverless 触发不跑其他的
      return this.resolveResult('routes-gen', { routes: [] });
    }
    return this.resolveResult('routes-gen', { routes });
  }
}

module.exports = KumexProHandler;
