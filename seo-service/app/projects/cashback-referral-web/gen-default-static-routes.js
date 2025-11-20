/**
 * 获取 cashback-referral-web 静态路由
 * Owner: melon@kupotech.com
 */

const logger = require('@app/worker/logger');

const staticRoutes = ['/invite-to-earn'];

module.exports = async function() {
  logger.debug(`start get default routes for ${this.host}${this.entry}`);
  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'default-static',
    priority: 1,
    withoutLang: [],
    withLang: null,
    isApp: false,
    themes: [THEME_DEFAULT],
  };
  return this.stopFlag
    ? routesInfo
    : {
      ...routesInfo,
      withoutLang: staticRoutes,
    };
};
