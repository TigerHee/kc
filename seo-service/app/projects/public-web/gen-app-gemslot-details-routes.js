/*
 * @owner: borden@kupotech.com
 */
const request = require('@utils/request');
const logger = require('@app/worker/logger');
const REQUEST_API = '/_api/campaign-center/gemslots/project/code-list';

module.exports = async function() {
  logger.debug(
    `start get app-gemslot-details routes for ${this.host}${this.entry}`
  );
  const api = `${this.apiHost}${REQUEST_API}`;
  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'app-gemslot-details',
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
    const list = result.items || [];
    const routes = list.filter(code => !code).map(code => {
      return `/gemslot/detail/code/${code}`;
    });

    return this.stopFlag
      ? routesInfo
      : {
        ...routesInfo,
        withoutLang: routes,
      };
  } catch (err) {
    logger.error(`Request app-gemslot-details ${api} error`, err);
    return routesInfo;
  }
};
