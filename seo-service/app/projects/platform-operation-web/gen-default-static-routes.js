/**
 * 获取 operation-web 静态路由
 * Owner: terry@kupotech.com
 */

const logger = require('@app/worker/logger');

const staticRoutes = [
  '/land/KuRewards',
  '/land/earn-crypto-rewards-by-referring',
];

module.exports = async function() {
  logger.debug(`start get default routes for ${this.host}${this.entry}`);
  const { THEME_DEFAULT, THEME_DARK } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'default-static',
    priority: 1,
    withoutLang: [],
    withLang: null,
    isApp: false,
    themes: [THEME_DEFAULT, THEME_DARK],
  };
  return this.stopFlag
    ? routesInfo
    : {
      ...routesInfo,
      withoutLang: staticRoutes,
    };
};
