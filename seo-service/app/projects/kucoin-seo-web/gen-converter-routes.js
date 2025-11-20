/**
 * 获取 kucoin-seo-web 所有 converter 路由
 * Owner: ella.wang@kupotech.com
 */
const request = require('@utils/request');
const logger = require('@app/worker/logger');
const { USE_SERVERLESS } = require('@scripts/config');
const decreaseRoutes = require('@utils/decrease-routes');

const REQUEST_API = '/_api/currency/rates?base=USD';
const COINS = ['BTC', 'ETH', 'USDT'];

module.exports = async function() {
  logger.debug(`start get converter routes for ${this.host}${this.entry}`);
  const api = `${this.apiHost}${REQUEST_API}`;
  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'converter',
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
    const currencyList = [];
    if (result.data) {
      for (const key in result.data) {
        if (Object.prototype.hasOwnProperty.call(result.data, key)) {
          currencyList.push(key);
        }
      }
    }
    const data = currencyList.filter(i => i !== 'CNY');
    const pathsCoin = [];
    data.forEach(currency => {
      COINS.forEach(item => {
        pathsCoin.push(`${item}-${currency}`);
      });
    });
    let routes = pathsCoin.map(item => `/converter/${item}`);
    if (!this.configs.IS_PRO_ENV) {
      routes = decreaseRoutes(routes, { reservedRoutes: ['/converter'] });
    } else {
      routes.push('/converter');
    }
    return this.stopFlag
      ? routesInfo
      : {
        ...routesInfo,
        withoutLang: routes,
        useServerless: USE_SERVERLESS,
      };
  } catch (err) {
    logger.error(`Request converter ${api} error`, err);
    return routesInfo;
  }
};
