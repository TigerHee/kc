/**
 * Owner: Chelsey.Fan@kupotech.com
 */
const request = require('@utils/request');
const robot = require('@app/master/robot');
const logger = require('@app/master/logger');
const { THEME_DEFAULT } = require('@scripts/themes');
const { USE_SERVERLESS } = require('@scripts/config');
const startServerlessJob = require('@app/master/serverless-gen');

const BASE_API = 'http://cms.kucoin/inner/articles';
const CATEGORY_REQUEST_API = '/_api/cms/category';
const TYPE_BLOG = 3;

async function getBlogCategoryRoutes(host, lang, oldLang) {
  const api = `${host}${CATEGORY_REQUEST_API}?type=3&lang=${oldLang}`;
  const { data: categories } = await request(api);
  const categoryRoutes = categories.map(v => {
    const name = v.en_name.replace(/\s/g, '-');
    return lang === 'en'
      ? `/blog/categories/${name}`
      : `/${lang}/blog/categories/${name}`;
  });
  categoryRoutes.push(lang === 'en' ? '/blog' : `/${lang}/blog`);
  return categoryRoutes;
}

const checkLangBlogUpdate = async (oldLang, timeQuery, staticMap) => {
  const api = `${BASE_API}?type=${TYPE_BLOG}&lang=${oldLang}&pageSize=50${timeQuery}`;
  try {
    const result = await request(api);
    if (result && result.code === 200 && result.success) {
      if (result.items && result.items.length) {
        const blogRoutes = result.items.map(item => item.path);
        staticMap[oldLang] = { len: result.items.length };
        return blogRoutes;
      }
    }
    return [];
  } catch (err) {
    logger.error(`CMS 博客内容更新检查错误，API: ${api}`, err);
    return [];
  }
};

async function checkBlogUpdate() {
  logger.info('检查 CMS 博客内容更新');
  const host = this.master.options.config.host;
  const langsConfig = this.master.options.config.langs;
  // 查询统计
  const staticMap = {};
  // 这里的时间与定时轮训的时间相差一点
  const startTime = Date.now() - 12.2 * 60 * 60 * 1000;
  const endTime = Date.now();
  const timeQuery = `&start_time=${startTime}&end_time=${endTime}`;
  const withLangRoutesMap = {};
  const langs = [];
  for (const oldLang of langsConfig.oldLangs) {
    const routes = await checkLangBlogUpdate(oldLang, timeQuery, staticMap);
    if (staticMap[oldLang]) {
      const lang = langsConfig.oldToNew[oldLang];
      // 有 blog 更新，则更新所有分类页
      const categoryRoutes = await getBlogCategoryRoutes(host, lang, oldLang);
      const blogRoutes = routes.map(route => {
        return lang === 'en' ? `/blog${route}` : `/${lang}/blog${route}`;
      });
      withLangRoutesMap[lang] = [...categoryRoutes, ...blogRoutes];
      staticMap[oldLang].query = timeQuery;
      langs.push(lang);
      logger.info(`CMS 博客内容更新，语言 ${lang}`, routes);
    }
  }
  if (Object.keys(withLangRoutesMap).length === 0) {
    logger.info('CMS 博客内容无更新');
    return;
  }
  const msg = Object.keys(staticMap).reduce((rslt, oldLang) => {
    const { len, query } = staticMap[oldLang];
    rslt += `<div>${oldLang}: ${len},  查询参数${query}</div>`;
    return rslt;
  }, 'CMS 博客更新: ');
  robot.info(msg, false);

  if (USE_SERVERLESS) {
    const projectConfig =
      this.master.options.config.projectConfigs['seo-cms-web'];
    const thisObj = {
      config: projectConfig,
      entry: projectConfig.entry,
      host,
    };
    await startServerlessJob.call(thisObj, langs, {
      withoutLang: [],
      withLang: withLangRoutesMap,
      routeSetName: 'routes',
      isApp: false,
      themes: [THEME_DEFAULT],
      useServerless: USE_SERVERLESS,
    });
  } else {
    this.master.onCMSUpdate({
      projectName: 'seo-cms-web',
      routes: {
        withoutLang: [],
        withLang: withLangRoutesMap,
        isApp: false,
        themes: [THEME_DEFAULT],
      },
    });
  }
}

module.exports = checkBlogUpdate;
