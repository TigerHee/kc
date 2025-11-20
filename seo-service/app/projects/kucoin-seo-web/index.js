/**
 * Owner: hanx.wei@kupotech.com
 */
const BaseProjectHandler = require('../common/base');
const genHowToBuyRoutes = require('./gen-htb-routes');
const genConverterRoutes = require('./gen-converter-routes');
const startServerlessJob = require('../common/serverless-gen');

class KucoinSeoHandler extends BaseProjectHandler {
  constructor(configs, puppeteerManager, messenger) {
    super(configs, puppeteerManager, messenger);
    this.config = configs.projectConfigs['kucoin-seo-web'];
    this.entry = this.config.entry;
  }

  async genRoutes(params) {
    const routes = [];
    const serverlessRoutes = [];
    for (const routeSet of params.routeSets) {
      let routesInfo;
      switch (routeSet) {
        case 'how-to-buy':
          routesInfo = await genHowToBuyRoutes.call(this);
          break;
        case 'converter':
          routesInfo = await genConverterRoutes.call(this);
          break;
        default:
          break;
      }
      if (routesInfo) {
        if (routesInfo.useServerless) {
          serverlessRoutes.push(routesInfo);
        } else {
          routes.push(routesInfo);
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

module.exports = KucoinSeoHandler;
