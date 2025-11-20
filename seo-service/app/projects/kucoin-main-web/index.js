/**
 * Owner: hanx.wei@kupotech.com
 */
const BaseProjectHandler = require('../common/base');
const logger = require('@app/worker/logger');
const genDefaultRoutes = require('./gen-default-routes');

class KucoinMainHandler extends BaseProjectHandler {
  constructor(configs, puppeteerManager, messenger) {
    super(configs, puppeteerManager, messenger);
    this.config = configs.projectConfigs['kucoin-main-web'];
    this.entry = this.config.entry;
  }

  async genRoutes(params) {
    const routes = [];
    for (const routeSet of params.routeSets) {
      let currentRoutes;
      switch (routeSet) {
        case 'default':
          currentRoutes = await genDefaultRoutes.call(this);
          break;
        default:
          break;
      }
      currentRoutes && routes.push(currentRoutes);
      if (this.stopFlag) {
        this.stopFlag = false;
        logger.debug(`worker ${process.env.worker_index} send stopped message`);
        return this.resolveResult('worker-handler-stopped');
      }
    }
    return this.resolveResult('routes-gen', { routes });
  }
}

module.exports = KucoinMainHandler;
