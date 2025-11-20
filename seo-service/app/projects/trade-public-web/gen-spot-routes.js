/**
 * 获取 trade-public-web 所有 markets spot路由
 * Owner: jessie@kupotech.com
 */
const request = require('@utils/request');
const logger = require('@app/worker/logger');
const REQUEST_API = '/_api/market-front/spot/category';

module.exports = async function() {
  logger.debug(`start get spot routes for ${this.host}${this.entry}`);
  const api = `${this.apiHost}${REQUEST_API}`;
  const { THEME_DEFAULT, THEME_DARK } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'spot',
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
    const routes = (currencies || []).map(item => `/markets/spot/${item.name}`);

    return this.stopFlag
      ? routesInfo
      : {
        ...routesInfo,
        withoutLang: routes,
      };
  } catch (err) {
    logger.error(`Request spot ${api} error`, err);
    return routesInfo;
  }
};
