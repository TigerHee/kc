/**
 * Owner: hanx.wei@kupotech.com
 */
const request = require('@utils/request');
const ensureAnnouncementPath = require('@utils/ensure-announcement-path');
const getAnnouncementStaticRoutes = require('@utils/get-announcement-static-routes');
const robot = require('@app/master/robot');
const logger = require('@app/master/logger');
const { THEME_DEFAULT } = require('@scripts/themes');
const { USE_SERVERLESS } = require('@scripts/config');
const startServerlessJob = require('@app/master/serverless-gen');

const BASE_API = 'http://cms.kucoin/inner/articles';
const TYPE_ANNOUNCEMENT = 1;
const announcementStaticRoutes = getAnnouncementStaticRoutes();

const checkLangAnnouncementUpdate = async (oldLang, timeQuery, staticMap) => {
  const api = `${BASE_API}?type=${TYPE_ANNOUNCEMENT}&lang=${oldLang}&pageSize=50${timeQuery}`;
  try {
    const result = await request(api);
    if (result && result.code === 200 && result.success) {
      if (result.items && result.items.length) {
        // 如果有更新，公告静态列表页也需要更新
        const announcementRoutes = [...announcementStaticRoutes];
        staticMap[oldLang] = { len: result.items.length };
        result.items.forEach(item => {
          const routePath = ensureAnnouncementPath(item.path);
          const routeFullPath = `/announcement${routePath}`;
          announcementRoutes.push(routeFullPath);
        });
        return announcementRoutes;
      }
    }
    return [];
  } catch (err) {
    logger.error(`CMS 公告内容更新检查错误，API: ${api}`, err);
    return [];
  }
};

async function checkAnnouncementUpdate() {
  logger.info('检查 CMS 公告内容更新');
  const langsConfig = this.master.options.config.langs;
  const host = this.master.options.config.host;
  const langs = [];
  // 查询统计
  const staticMap = {};
  // 这里的时间与定时轮训的时间相差一点
  const startTime = Date.now() - 12.1 * 60 * 60 * 1000;
  const endTime = Date.now();
  const timeQuery = `&start_time=${startTime}&end_time=${endTime}`;
  const withLangRoutesMap = {};
  for (const oldLang of langsConfig.oldLangs) {
    const routes = await checkLangAnnouncementUpdate(
      oldLang,
      timeQuery,
      staticMap
    );
    if (staticMap[oldLang]) {
      const lang = langsConfig.oldToNew[oldLang];
      staticMap[oldLang].query = timeQuery;
      langs.push(lang);
      withLangRoutesMap[lang] = routes.map(route => {
        return lang === 'en' ? route : `/${lang}${route}`;
      });
      logger.info(`CMS 公告内容更新，语言 ${lang}`, routes);
    }
  }
  if (Object.keys(withLangRoutesMap).length === 0) {
    logger.info('CMS 公告内容无更新');
    return;
  }
  const msg = Object.keys(staticMap).reduce((rslt, oldLang) => {
    const { len, query } = staticMap[oldLang];
    rslt += `<div>${oldLang}: ${len},  查询参数${query}</div>`;
    return rslt;
  }, 'CMS 公告更新: ');
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

module.exports = checkAnnouncementUpdate;
