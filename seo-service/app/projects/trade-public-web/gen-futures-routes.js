/**
 * 获取 trade-public-web 所有 markets futures路由
 * Owner: jessie@kupotech.com
 */
const request = require('@utils/request');
const logger = require('@app/worker/logger');
const REQUEST_API =
  '/_api_kumex/kumex-contract/contracts/tradeArea/getAvailableV2';

module.exports = async function() {
  logger.debug(`start get futures routes for ${this.host}${this.entry}`);
  const api = `${this.apiHost}${REQUEST_API}`;
  const { THEME_DEFAULT, THEME_DARK } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'futures',
    priority: 3,
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
    const routes = (currencies || []).map(item => {
      const nameJson = JSON.parse(item.displayName);
      if (nameJson?.en_US) {
        const tabKey = nameJson?.en_US?.split(' ').join('');
        return `/markets/futures/${tabKey}`;
      }
      return null;
    });

    return this.stopFlag
      ? routesInfo
      : {
        ...routesInfo,
        withoutLang: routes,
      };
  } catch (err) {
    logger.error(`Request futures ${api} error`, err);
    return routesInfo;
  }
};
