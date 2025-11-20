/*
 * @owner: borden@kupotech.com
 */
const logger = require('@app/worker/logger');

const staticRoutes = [
  '/margin-data/loan-rates',
  '/margin-data/cross-risk-limit',
  '/margin-data/isolated-risk-limit',
  '/margin-data/spot-index',
  '/margin-analysis/cross',
  '/margin-analysis/isolated',
];

module.exports = async function() {
  logger.debug(`start get default routes for ${this.host}${this.entry}`);
  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'app-default',
    priority: 3,
    withoutLang: [],
    withLang: null,
    isApp: true,
    themes: [THEME_DEFAULT],
  };
  return this.stopFlag
    ? routesInfo
    : {
      ...routesInfo,
      withoutLang: staticRoutes,
    };
};
