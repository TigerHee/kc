/**
 * Owner:sherry.li@kupotech.com
 */
const { USE_SERVERLESS } = require('@scripts/config');
const logger = require('@app/worker/logger');
const request = require('@utils/request');
const decreaseRoutes = require('@utils/decrease-routes');

const PAGE_SIZE = 8;
const prefix = 'seo-content-eco-service';
const OPTION = { count: 5 };

// 首页/分页 & 已结束项目详情路由
async function getClosedProjectsRoutesWithOutLang(page, apiHost, isPro) {
  try {
    let routes = [];
    const listApi = `${apiHost}/_api/${prefix}/web/article/page?page=${page}&pageSize=${PAGE_SIZE}&statusList=7&zoneLv1Code=learn-and-earn&lang=en_US`;
    const resData = await request(listApi);
    if (resData && resData.success && resData.items) {
      const detailsRoutes = resData.items.map(item => {
        return `/learn-and-earn/${encodeURIComponent(
          item.articleActivityResponse.currencyGenCode
        )}`;
      });
      routes = routes.concat(detailsRoutes);
      // 翻页路由
      if (page === 1 && resData.totalPage > 1) {
        for (let i = 2; i <= resData.totalPage; i++) {
          routes.push(`/learn-and-earn/page/${i}`);
        }
      }
      if (resData.totalPage > resData.currentPage) {
        const nextPaths = await getClosedProjectsRoutesWithOutLang(
          page + 1,
          apiHost,
          isPro
        );
        routes = routes.concat(nextPaths);
      }
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request getClosedProjectsRoutesWithOutLang failed, ${error}`);
    return [];
  }
}

// 活动中项目详情路由
async function getActiveProjectRoutesWithOutLang(apiHost, isPro) {
  try {
    let routes = [];
    const listApi = `${apiHost}/_api/${prefix}/web/article/page?page=1&pageSize=500&statusList=6&zoneLv1Code=learn-and-earn&lang=en_US`;
    const resData = await request(listApi);
    if (resData && resData.success && resData.items) {
      const detailsRoutes = resData.items.map(item => {
        return `/learn-and-earn/${encodeURIComponent(
          item.articleActivityResponse.currencyGenCode
        )}`;
      });
      routes = routes.concat(detailsRoutes);
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (err) {
    console.log({ err });
    logger.error(`Request getActiveProjectRoutesWithOutLang failed, ${err}`);
  }
}

const getLearnAndEarnRoutesWithOutLang = async (apiHost, isPro) => {
  const staticRoutes = ['/learn-and-earn'];
  const closedRoutes = await getClosedProjectsRoutesWithOutLang(
    1,
    apiHost,
    isPro
  );
  const activeRoutes = await getActiveProjectRoutesWithOutLang(apiHost, isPro);
  return [...staticRoutes, ...closedRoutes, ...activeRoutes];
};

module.exports = async function() {
  logger.debug(`get learn and earn routes for ${this.host}${this.entry}`);
  let routes = [];
  try {
    routes = await getLearnAndEarnRoutesWithOutLang(
      this.host,
      this.configs.IS_PRO_ENV
    );
  } catch (error) {
    logger.error(`Request learn and earn closed project list failed, ${error}`);
  }

  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'learn-and-earn',
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
