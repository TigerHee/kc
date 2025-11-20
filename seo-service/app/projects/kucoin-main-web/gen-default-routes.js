/**
 * 获取 kucoin-main-web 静态路由
 * Owner: Chelsey.Fan@kupotech.com
 */
const logger = require('@app/worker/logger');

const staticRoutes = [
  '/about-us',
  '/careers',
  '/careers/job-opening',
  '/mining-pool',
  '/bitcoin-halving',
  '/ethereum-upgrade',
  '/copy-trading',
  '/web3-wallet',
  '/proof-of-reserves',
  '/security',
  '/spotlight-center',
  '/best-crypto-exchanges-award-2021-kucoin',
  '/content-creator-program',
  '/listing',
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
    themes: [THEME_DEFAULT],
  };
  return this.stopFlag
    ? routesInfo
    : {
      ...routesInfo,
      withoutLang: staticRoutes,
    };
};
