/**
 * Owner: ella.wang@kupotech.com
 */
const { USE_SERVERLESS } = require('@scripts/config');
const logger = require('@app/worker/logger');
const { getNewsRoutesWithOutLang } = require('./newsWebUtils');

module.exports = async function() {
  logger.debug(`get news routes for ${this.host}${this.entry}`);

  const routes =
    (await getNewsRoutesWithOutLang(this.host, this.configs.IS_PRO_ENV)) || [];

  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'news',
    priority: 4,
    withoutLang: [],
    withLang: null,
    isApp: false,
    themes: [THEME_DEFAULT],
    useServerless: USE_SERVERLESS,
  };
  return this.stopFlag
    ? routesInfo
    : {
      ...routesInfo,
      withoutLang: routes,
    };
};
