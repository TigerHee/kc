/**
 * 获取 operation-web 静态路由
 * Owner: terry@kupotech.com
 */
const logger = require('@app/worker/logger');

const staticRoutes = [
  '/platform/KuRewards',
  '/platform/earn-crypto-rewards-by-referring',
  '/platform/account/vouchers',
  '/platform/account/vouchers/instruction',
  '/platform/market-movement',
  '/platform/wealth-calender',
];

module.exports = async function() {
  logger.debug(`start get app default routes for ${this.host}${this.entry}`);
  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'app-default-static',
    priority: 1,
    withoutLang: [],
    withLang: null,
    isApp: true,
    // themes: [ THEME_DEFAULT, THEME_DARK ], // dark 主题测试
    themes: [THEME_DEFAULT], // dark 主题测试
  };
  return this.stopFlag
    ? routesInfo
    : {
      ...routesInfo,
      withoutLang: staticRoutes,
    };
};
