/**
 * Owner: ella.wang@kupotech.com
 */
const BaseProjectHandler = require('../common/base');
const genAnnouncementRoutes = require('./gen-announcement-routes');
const genBlogRoutes = require('./gen-blog-routes');
const startServerlessJob = require('../common/serverless-gen');

class SeoCmsWebHandler extends BaseProjectHandler {
  constructor(configs, puppeteerManager, messenger) {
    super(configs, puppeteerManager, messenger);
    this.config = configs.projectConfigs['seo-cms-web'];
    this.entry = this.config.entry;
  }

  async genRoutes(params) {
    const routes = [];
    const serverlessRoutes = [];
    for (const routeSet of params.routeSets) {
      let routesInfo;
      switch (routeSet) {
        case 'announcement':
          routesInfo = await genAnnouncementRoutes.call(this, params.langs);
          break;
        case 'blog':
          routesInfo = await genBlogRoutes.call(this, params.langs);
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

module.exports = SeoCmsWebHandler;
