/**
 * Owner: Chelsey.Fan@kupotech.com
 */
const logger = require('@app/worker/logger');
const request = require('@utils/request');
const REQUEST_API = '/_api/zendesk/api/v2/help_center';
const zElanguages = require('@scripts/langs/zElanguages.js');
const decreaseRoutes = require('@utils/decrease-routes');
const { USE_SERVERLESS } = require('@scripts/config');

const transLang = langParam => {
  return zElanguages[langParam];
};
async function getArticle(sectionId, lang, langParam, currentLangSupports) {
  let articlesRoutes = [];
  const articlesAPI = `${this.apiHost}${REQUEST_API}/${transLang(
    langParam
  )}/sections/${sectionId}/articles.json?per_page=100`;
  try {
    const articlesResult = (await request(articlesAPI)).data.articles || [];
    articlesRoutes = articlesResult.map(article => {
      return lang === 'en'
        ? `/support/${article.id}`
        : `/${lang}/support/${article.id}`;
    });
    currentLangSupports.push(...articlesRoutes);
    // return articlesRoutes;
  } catch (err) {
    logger.error(`Request supports ${articlesAPI} error`, err);
  }
}

async function getSections(categoriesId, lang, langParam, currentLangSupports) {
  const _that = this;
  const sectionsAPI = `${this.apiHost}${REQUEST_API}/${transLang(
    langParam
  )}/categories/${categoriesId}/sections.json?per_page=100`;
  try {
    const sectionsResult = (await request(sectionsAPI)).data.sections || [];
    const sectionRoutes = sectionsResult.map(section => {
      return lang === 'en'
        ? `/support/sections/${section.id}`
        : `/${lang}/support/sections/${section.id}`;
    });
    currentLangSupports.push(...sectionRoutes);
    // articles
    await Promise.allSettled(
      sectionsResult.map(i =>
        getArticle.call(_that, i.id, lang, langParam, currentLangSupports)
      )
    );
  } catch (err) {
    logger.error(`Request supports ${sectionsAPI} error`, err);
  }
}

async function requestSupports(lang) {
  const currentLangSupports = [];
  const _that = this;
  const langParam = this.langConfigs.newToOld[lang];
  const categoriesAPI = `${this.apiHost}${REQUEST_API}/${transLang(
    langParam
  )}/categories.json?per_page=100`;
  let categoriesResult = [];
  // categories
  try {
    categoriesResult = (await request(categoriesAPI)).data.categories || [];
    const categoriesRoutes = categoriesResult.map(function(item) {
      return lang === 'en'
        ? `/support/categories/${item?.id}`
        : `/${lang}/support/categories/${item?.id}`;
    });
    currentLangSupports.push(...categoriesRoutes);

    //  sections
    await Promise.allSettled(
      categoriesResult.map(i =>
        getSections.call(_that, i.id, lang, langParam, currentLangSupports)
      )
    );
    return currentLangSupports;
  } catch (err) {
    logger.error(`Request supports ${categoriesAPI} error`, err);
  }
}

module.exports = async function(langs) {
  logger.debug(`start get support routes for ${this.host}${this.entry}`);
  const supportStaticRoutes = ['/support', '/support/search'];
  const allSupports = {};
  const result = await Promise.allSettled(
    langs.map(lang => {
      return requestSupports.call(this, lang);
    })
  );

  result.forEach((i, index) => {
    if (i.status === 'fulfilled') {
      if (!this.configs.IS_PRO_ENV) {
        allSupports[langs[index]] = decreaseRoutes(i.value || []);
      } else {
        allSupports[langs[index]] = i.value || [];
      }
    }
  });

  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'support',
    priority: 3,
    withoutLang: [],
    withLang: null,
    isApp: false,
    themes: [THEME_DEFAULT],
  };

  return this.stopFlag
    ? routesInfo
    : {
      ...routesInfo,
      withoutLang: supportStaticRoutes,
      withLang: allSupports,
      useServerless: USE_SERVERLESS,
    };
};
