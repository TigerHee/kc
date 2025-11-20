/**
 * 获取 marketing growth web 静态路由
 * Owner: hanx.wei@kupotech.com
 */
const logger = require('@app/worker/logger');

const staticRoutes = [
  '/referral',
  '/referral/refer-and-earn',
  '/affiliate',
  '/affiliate-apply',
];

module.exports = async function() {
  logger.debug(`start get default routes for ${this.host}${this.entry}`);
  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'default',
    priority: 1,
    withoutLang: [],
    withLang: null,
    isApp: false,
    themes: [ THEME_DEFAULT ],
  };
  return this.stopFlag ? routesInfo : {
    ...routesInfo,
    withoutLang: staticRoutes,
  };
};
