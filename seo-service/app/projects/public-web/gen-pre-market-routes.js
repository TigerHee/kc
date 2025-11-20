/**
 * 获取 public-web 所有 盘前交易 币种路由
 * Owner: jessie@kupotech.com
 */
const request = require('@utils/request');
const logger = require('@app/worker/logger');
const decreaseRoutes = require('@utils/decrease-routes');
const REQUEST_API = '/_api/grey-market-trade/grey/market/currencies';

module.exports = async function() {
  logger.debug(`start get pre-market routes for ${this.host}${this.entry}`);
  const api = `${this.apiHost}${REQUEST_API}`;

  const { THEME_DEFAULT, THEME_DARK } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'pre-market',
    priority: 2,
    withoutLang: [],
    withLang: null,
    isApp: false,
    themes: [THEME_DEFAULT, THEME_DARK],
  };
  try {
    const result = await request(api);
    if (result.code !== '200' || !result.success) {
      throw new Error(`Request ${api} failed, code ${result.code}`);
    }
    const currencies = result.data || [];
    let routes = currencies.map(item => `/pre-market/${item.shortName}`);
    if (!this.configs.IS_PRO_ENV) {
      routes = decreaseRoutes(routes, { count: 5 });
    }

    return this.stopFlag
      ? routesInfo
      : {
        ...routesInfo,
        withoutLang: routes,
      };
  } catch (err) {
    logger.error(`Request pre-market ${api} error`, err);
    return routesInfo;
  }
};
