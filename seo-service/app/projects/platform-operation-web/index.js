/**
 * Owner: terry@kupotech.com
 */
const BaseProjectHandler = require('../common/base');
const logger = require('@app/worker/logger');
const genDefaultStaticRoutes = require('./gen-default-static-routes');
// const genAppDefaultStaticRoutes = require('./gen-app-default-static-routes');

class OperationHandler extends BaseProjectHandler {
  constructor(configs, puppeteerManager, messenger) {
    super(configs, puppeteerManager, messenger);
    this.config = configs.projectConfigs['platform-operation-web'];
    this.entry = this.config.entry;
  }

  async genRoutes(params) {
    const routes = [];
    for (const routeSet of params.routeSets) {
      let currentRoutes;
      switch (routeSet) {
        case 'default-static':
          currentRoutes = await genDefaultStaticRoutes.call(this);
          break;
        // case 'app-default-static':
        //   currentRoutes = await genAppDefaultStaticRoutes.call(this);
        //   break;
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

module.exports = OperationHandler;
