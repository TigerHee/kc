/**
 * 获取 public-web 所有 gempool 币种详情路由(app)
 * Owner: jessie@kupotech.com
 */
const request = require('@utils/request');
const logger = require('@app/worker/logger');
const decreaseRoutes = require('@utils/decrease-routes');
const REQUEST_API = '/_api/gem-staking-front/gempool/staking/earnTokenList';

module.exports = async function() {
  logger.debug(
    `start get app gempool detail routes for ${this.host}${this.entry}`
  );
  const api = `${this.apiHost}${REQUEST_API}`;

  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'app-gempool-detail',
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
    const currencies = result.data || [];
    let routes = currencies.map(item => `/gempool/${item}`);
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
    logger.error(`Request app gempool detail ${api} error`, err);
    return routesInfo;
  }
};
