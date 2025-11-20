/*
 * @owner: borden@kupotech.com
 */
const logger = require('@app/worker/logger');

const staticRoutes = [
  '/margin/v2/lend',
  '/leveraged-tokens',
  '/margin-data/loan-rates',
  '/margin-data/cross-risk-limit',
  '/margin-data/isolated-risk-limit',
  '/margin-data/spot-index',
  '/margin-analysis/cross',
  '/margin-analysis/isolated',
];

module.exports = async function() {
  logger.debug(`start get default routes for ${this.host}${this.entry}`);
  const { THEME_DEFAULT, THEME_DARK } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'default',
    priority: 2,
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
