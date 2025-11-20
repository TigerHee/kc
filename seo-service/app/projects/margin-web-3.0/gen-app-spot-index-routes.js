/*
 * @owner: borden@kupotech.com
 */
const request = require('@utils/request');
const logger = require('@app/worker/logger');
// 当前有158个币对
const REQUEST_API =
  '/_api/market-front/search?currentPage=1&pageSize=10000&subCategory=spot_index&tabType=SPOT';

module.exports = async function() {
  logger.debug(`start get spot-index routes for ${this.host}${this.entry}`);
  const api = `${this.apiHost}${REQUEST_API}`;
  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'app-spot-index',
    priority: 3,
    withoutLang: [],
    withLang: null,
    isApp: true,
    themes: [THEME_DEFAULT],
  };
  try {
    const result = await request(api);
    if (result.code !== '200' || !result.success) {
      throw new Error(`Request ${api} failed, code ${result.code}`);
    }
    const list = result.data.data || [];
    const routes = list.map(item => {
      return `/margin-data/spot-index/${item.symbolCode}`;
    });

    return this.stopFlag
      ? routesInfo
      : {
        ...routesInfo,
        withoutLang: routes,
      };
  } catch (err) {
    logger.error(`Request spot-index ${api} error`, err);
    return routesInfo;
  }
};
