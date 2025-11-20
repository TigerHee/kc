/**
 * 获取 seo-cms-web 所有语言 announcement 路由
 * Owner: hanx.wei@kupotech.com
 */
const request = require('@utils/request');
const ensureAnnouncementPath = require('@utils/ensure-announcement-path');
const getAnnouncementStaticRoutes = require('@utils/get-announcement-static-routes');
const logger = require('@app/worker/logger');
const { USE_SERVERLESS } = require('@scripts/config');
const decreaseRoutes = require('@utils/decrease-routes');

const REQUEST_API = '/_api/cms/articles';
const PAGE_SIZE = 100;

async function requestAnnouncements(
  pagination,
  lang,
  currentLangAnnouncements
) {
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
  const api = `${this.apiHost}${REQUEST_API}?page=${pagination.page}&pageSize=${pagination.pageSize}&lang=${langParam}`;
  try {
    const result = await request(api);
    if (result.code !== 200 || !result.success) {
      throw new Error(`Request ${api} failed, code ${result.code}`);
    }
    pagination.totalNum = result.totalNum;
    const routes = (result.items || []).map(item => {
      const routePath = ensureAnnouncementPath(item.path);
      const prefix = 'announcement';
      return lang === 'en'
        ? `/${prefix}${routePath}`
        : `/${lang}/${prefix}${routePath}`;
    });
    currentLangAnnouncements.push(...routes);
    await requestAnnouncements.call(
      this,
      {
        ...pagination,
        page: pagination.page + 1,
      },
      lang,
      currentLangAnnouncements
    );
  } catch (err) {
    logger.error(`Request announcement ${api} error`, err);
    // 跳过，请求下一页
    await requestAnnouncements.call(
      this,
      {
        ...pagination,
        page: pagination.page + 1,
      },
      lang,
      currentLangAnnouncements
    );
  }
}

module.exports = async function(langs) {
  logger.debug(`start get announcement routes for ${this.host}${this.entry}`);
  const announcementStaticRoutes = getAnnouncementStaticRoutes();
  const allAnnouncements = {};
  for (const lang of langs) {
    if (this.stopFlag) break;
    const currentLangAnnouncements = [];
    await requestAnnouncements.call(
      this,
      { page: 1, pageSize: PAGE_SIZE },
      lang,
      currentLangAnnouncements
    );
    // 每个语种只要20条
    if (!this.configs.IS_PRO_ENV) {
      allAnnouncements[lang] = decreaseRoutes(currentLangAnnouncements, {
        count: 20,
      });
    } else {
      allAnnouncements[lang] = currentLangAnnouncements;
    }
  }
  const { THEME_DEFAULT, THEME_DARK } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'announcement',
    priority: 5,
    withoutLang: [],
    withLang: null,
    isApp: false,
    themes: [THEME_DEFAULT, THEME_DARK],
  };
  return this.stopFlag
    ? routesInfo
    : {
      ...routesInfo,
      withoutLang: announcementStaticRoutes,
      withLang: allAnnouncements,
      useServerless: USE_SERVERLESS,
    };
};
