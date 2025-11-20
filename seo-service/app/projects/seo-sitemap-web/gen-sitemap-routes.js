/**
 * 获取 seo-sitemap-web 所有 sitemap 币种路由
 * Owner: ella.wang@kupotech.com
 */
const logger = require('@app/worker/logger');
const {
  getSitemapRoutesWithOutLang,
  getSitemapRoutesWithLang,
} = require('./sitemapUtils');
const { USE_SERVERLESS } = require('@scripts/config');

module.exports = async function(langs) {
  logger.debug(`start get sitemap routes for ${this.host}${this.entry}`);
  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'sitemap',
    priority: 3,
    withoutLang: [],
    withLang: null,
    isApp: false,
    themes: [THEME_DEFAULT],
  };
  try {
    const routes =
      (await getSitemapRoutesWithOutLang(this.host, this.configs.IS_PRO_ENV)) ||
      [];
    const routesWithLang = await getSitemapRoutesWithLang(
      this.host,
      langs,
      this.configs.IS_PRO_ENV
    );
    return this.stopFlag
      ? routesInfo
      : {
        ...routesInfo,
        withoutLang: routes,
        withLang: routesWithLang,
        useServerless: USE_SERVERLESS,
      };
  } catch (err) {
    logger.error('Request sitemap error', err);
    return routesInfo;
  }
};
