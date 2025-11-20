/*
 * @owner: borden@kupotech.com
 */
const request = require('@utils/request');
const logger = require('@app/worker/logger');
// 当前有101个代币
const REQUEST_API = '/_api/margin-fund/fund/currency/base-list';

module.exports = async function() {
  logger.debug(`start get etf-details routes for ${this.host}${this.entry}`);
  const api = `${this.apiHost}${REQUEST_API}`;
  const { THEME_DEFAULT, THEME_DARK } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'etf-details',
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
    const list = result.data || [];
    const routes = list.map(item => {
      return `/leveraged-tokens/detail/${item.code}`;
    });

    return this.stopFlag
      ? routesInfo
      : {
        ...routesInfo,
        withoutLang: routes,
      };
  } catch (err) {
    logger.error(`Request etf-details ${api} error`, err);
    return routesInfo;
  }
};
