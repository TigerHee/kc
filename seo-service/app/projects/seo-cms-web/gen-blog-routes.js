/**
 * 获取 seo-cms-web 所有语言 blog 路由
 * Owner: Chelsey.Fan@kupotech.com
 */
const request = require('@utils/request');
const { USE_SERVERLESS } = require('@scripts/config');
const logger = require('@app/worker/logger');
const decreaseRoutes = require('@utils/decrease-routes');

const REQUEST_API = '/_api/cms/articles';
const CATEGORY_REQUEST_API = '/_api/cms/category';
const PAGE_SIZE = 100;

async function getBlogCategoryRoutes(lang) {
  const langParam = this.langConfigs.newToOld[lang];
  const api = `${this.apiHost}${CATEGORY_REQUEST_API}?type=3&lang=${langParam}`;
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

async function requestBlog(pagination, lang, currentLangBlogs) {
  if (
    // 开发只请求第一页
    (this.configs.isTest ? pagination.page > 1 : false) ||
    // 生产判断请求到最后一页
    (pagination.totalNum &&
      (pagination.page - 1 || 1) * pagination.pageSize >= pagination.totalNum)
  ) {
    return;
  }
  const langParam = this.langConfigs.newToOld[lang];
  const api = `${this.apiHost}${REQUEST_API}?type=3&page=${pagination.page}&pageSize=${pagination.pageSize}&lang=${langParam}`;
  try {
    const result = await request(api);
    if (result.code !== 200 || !result.success) {
      throw new Error(`Request ${api} failed, code ${result.code}`);
    }
    pagination.totalNum = result.totalNum;
    const routes = (result.items || []).map(item => {
      const routePath = item.path;
      return lang === 'en' ? `/blog${routePath}` : `/${lang}/blog${routePath}`;
    });
    currentLangBlogs.push(...routes);
    await requestBlog.call(
      this,
      {
        ...pagination,
        page: pagination.page + 1,
      },
      lang,
      currentLangBlogs
    );
  } catch (err) {
    logger.error(`Request blog ${api} error`, err);
    // 跳过，请求下一页
    await requestBlog.call(
      this,
      {
        ...pagination,
        page: pagination.page + 1,
      },
      lang,
      currentLangBlogs
    );
  }
}

module.exports = async function(langs) {
  logger.debug(`get blog routes for ${this.host}${this.entry}`);
  const allBlog = {};
  for (const lang of langs) {
    if (this.stopFlag) break;
    const currentLangBlogs = [];
    await requestBlog.call(
      this,
      { page: 1, pageSize: PAGE_SIZE },
      lang,
      currentLangBlogs
    );
    const blogCategoryRoutes = await getBlogCategoryRoutes.call(this, lang);
    if (!this.configs.IS_PRO_ENV) {
      allBlog[lang] = decreaseRoutes(currentLangBlogs, {
        reservedRoutes: blogCategoryRoutes,
      });
    } else {
      currentLangBlogs.push(...blogCategoryRoutes);
      allBlog[lang] = currentLangBlogs;
    }
  }

  const { THEME_DEFAULT, THEME_DARK } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'blog',
    priority: 3,
    withoutLang: [],
    withLang: null,
    isApp: false,
    themes: [THEME_DEFAULT, THEME_DARK],
    useServerless: USE_SERVERLESS,
  };
  return this.stopFlag
    ? routesInfo
    : {
      ...routesInfo,
      withLang: allBlog,
    };
};
