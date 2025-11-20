/*
 * @owner: borden@kupotech.com
 */
const BaseProjectHandler = require('../common/base');
const logger = require('@app/worker/logger');
const genDefaultRoutes = require('./gen-default-routes');
const genAPPDefaultRoutes = require('./gen-app-default-routes');
const genEtfDetailsRoutes = require('./gen-etf-details-routes');
const genSpotIndexRoutes = require('./gen-spot-index-routes');
const genAPPSpotIndexRoutes = require('./gen-app-spot-index-routes');

class MarginWebHandler extends BaseProjectHandler {
  constructor(configs, puppeteerManager, messenger) {
    super(configs, puppeteerManager, messenger);
    this.config = configs.projectConfigs['margin-web-3.0'];
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
        case 'app-default':
          currentRoutes = await genAPPDefaultRoutes.call(this);
          break;
        case 'etf-details':
          currentRoutes = await genEtfDetailsRoutes.call(this);
          break;
        case 'spot-index':
          currentRoutes = await genSpotIndexRoutes.call(this);
          break;
        case 'app-spot-index':
          currentRoutes = await genAPPSpotIndexRoutes.call(this);
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

module.exports = MarginWebHandler;
