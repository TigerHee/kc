/**
 * 获取 seo-price-web 所有币种路由
 * Owner: hanx.wei@kupotech.com
 */
const request = require('@utils/request');
const logger = require('@app/worker/logger');
const decreaseRoutes = require('@utils/decrease-routes');
const { USE_SERVERLESS } = require('@scripts/config');
const REQUEST_API = '/_api/quicksilver/universe-currency/market/currency-list';

const reservedCurrencies = {
  reservedRoutes: ['/price/BTC', '/price/ETH', '/price/KCS'],
};
module.exports = async function() {
  logger.debug(`start get price routes for ${this.host}${this.entry}`);
  const api = `${this.apiHost}${REQUEST_API}`;
  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'price',
    priority: 2,
    withoutLang: [],
    withLang: null,
    isApp: false,
    themes: [THEME_DEFAULT],
  };
  try {
    const result = await request(api);
    if (result.code !== '200' || !result.success) {
      throw new Error(`Request ${api} failed, code ${result.code}`);
    }
    const currencies = result.data || [];
    let routes = (currencies || [])
      .filter(item => !!item.currencyType)
      .map(item => `/price/${item.currency}`);
    if (!this.configs.IS_PRO_ENV) {
      routes = decreaseRoutes(routes, reservedCurrencies);
    }
    routes.push('/price/HAM');
    return this.stopFlag
      ? routesInfo
      : {
        ...routesInfo,
        withoutLang: routes,
        useServerless: USE_SERVERLESS,
      };
  } catch (err) {
    logger.error(`Request price ${api} error`, err);
    return routesInfo;
  }
};
