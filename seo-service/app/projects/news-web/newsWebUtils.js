/**
 * Owner: ella.wang@kupotech.com
 */
const request = require('@utils/request');
const decreaseRoutes = require('@utils/decrease-routes');
const logger = require('@app/worker/logger');

const PAGE_SIZE = 100;
const prefix = 'seo-content-eco-service';
const ShowPageSize = 10;
const HomeTabPageShowSize = 20;
const OPTION = { count: 5 };

// topic详情翻页路由 /news/topics/ella-topic-001/page/2
async function getTopicDetailPageRoutes(apiHost, topic, isPro) {
  try {
    const routes = [];
    const api = `${apiHost}/_api/${prefix}/web/article/page?relationTopicCode=${topic}&page=1&pageSize=${ShowPageSize}&lang=en_US`;
    const resData = await request(api);
    if (resData && resData.success && resData.items) {
      const totalPage = resData.totalPage;
      for (let i = 2; i <= totalPage; i++) {
        routes.push(`/news/topics/${topic}/page/${i}`);
      }
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request news topic detail article, ${error}`);
    return [];
  }
}

async function getUrlByTopicCodes(list, apiHost, isPro) {
  // 每一个topic详情页下的文章翻页url：
  let routes = [];
  for (let i = 0; i < list.length; i++) {
    const topicCode = list[i]?.topicCode;
    const topicDetailUrl = await getTopicDetailPageRoutes(
      apiHost,
      topicCode,
      isPro
    );
    routes = routes.concat(topicDetailUrl);
  }
  return routes;
}

async function getTopicBannerRoutes(apiHost, isPro) {
  try {
    const api = `${apiHost}/_api/${prefix}/web/topic/banner?lang=en_US`;
    const resData = await request(api);
    let routes = [];
    if (resData && resData.success && resData.items) {
      routes = resData.items.map(item => {
        return `/news/topics/${encodeURIComponent(item.topicCode)}`;
      });
      if (!isPro) {
        routes = decreaseRoutes(routes, OPTION);
      }
      const topicDetailUrl = await getUrlByTopicCodes(
        resData.items,
        apiHost,
        isPro
      );
      routes = routes.concat(topicDetailUrl);
    }
    return routes;
  } catch (error) {
    logger.error(`Request news topic banner failed, ${error}`);
    return [];
  }
}

async function getTopicListRoutes(page, apiHost, isPro) {
  try {
    let routes = [];
    const api = `${apiHost}/_api/${prefix}/web/topic/page?page=${page}&pageSize=${PAGE_SIZE}&lang=en_US`;
    const resData = await request(api);
    if (resData && resData.success && resData.items) {
      const list = resData.items.map(item => {
        return `/news/topics/${encodeURIComponent(item.topicCode)}`;
      });
      routes = routes.concat(list);
      // 翻页路由
      if (page === 1) {
        const totalPage = Math.ceil(resData.totalNum / ShowPageSize);
        for (let i = 2; i <= totalPage; i++) {
          routes.push(`/news/topics/page/${i}`);
        }
      }
      if (resData.totalPage > resData.currentPage) {
        const nextPaths = await getTopicListRoutes(page + 1, apiHost, isPro);
        routes = routes.concat(nextPaths);
      }
      if (!isPro) {
        routes = decreaseRoutes(routes, OPTION);
      }
      const topicDetailUrl = await getUrlByTopicCodes(
        resData.items,
        apiHost,
        isPro
      );
      routes = routes.concat(topicDetailUrl);
    }
    return routes;
  } catch (error) {
    logger.error(`Request news topic list failed, ${error}`);
    return [];
  }
}

// tag详情翻页路由 /news/tag/ella-tag-001/page/2
async function getTagDetailPageRoutes(apiHost, tagcode, isPro) {
  try {
    const routes = [];
    const api = `${apiHost}/_api/${prefix}/web/article/page?relationTagCode=${tagcode}&page=1&pageSize=${ShowPageSize}&lang=en_US`;
    const resData = await request(api);
    if (resData && resData.success && resData.items) {
      const totalPage = resData.totalPage;
      for (let i = 2; i <= totalPage; i++) {
        routes.push(`/news/tag/${tagcode}/page/${i}`);
      }
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request news tag detail article, ${error}`);
    return [];
  }
}

async function getUrlByTagCodes(list, apiHost, isPro) {
  // 每一个tag详情页下的文章翻页url：
  let routes = [];
  for (let i = 0; i < list.length; i++) {
    const tagCode = list[i]?.tagCode;
    const tagDetailUrl = await getTagDetailPageRoutes(apiHost, tagCode, isPro);
    routes = routes.concat(tagDetailUrl);
  }
  return routes;
}

async function getTagRoutes(apiHost, isPro) {
  try {
    const api = `${apiHost}/_api/${prefix}/web/tag/list?lang=en_US`;
    const resData = await request(api);
    let routes = [];
    if (resData && resData.success && resData.items) {
      routes = resData.items.map(item => {
        return `/news/tag/${encodeURIComponent(item.tagCode)}`;
      });
      if (!isPro) {
        routes = decreaseRoutes(routes, OPTION);
      }
      const tagDetailUrl = await getUrlByTagCodes(
        resData.items,
        apiHost,
        isPro
      );
      routes = routes.concat(tagDetailUrl);
    }
    return routes;
  } catch (error) {
    logger.error(`Request news tag list failed, ${error}`);
    return [];
  }
}

// 所有详情文章的url
async function getArticleListRoutes(page, apiHost, isPro) {
  try {
    let routes = [];
    const api = `${apiHost}/_api/${prefix}/web/article/page?page=${page}&pageSize=${PAGE_SIZE}&lang=en_US`;
    const resData = await request(api);
    if (resData && resData.success && resData.items) {
      const list = resData.items.map(item => {
        return `/news/articles/${encodeURIComponent(item.articleCode)}`;
      });
      routes = routes.concat(list);
      // 翻页路由
      if (page === 1) {
        const totalPage = Math.ceil(resData.totalNum / HomeTabPageShowSize);
        for (let i = 2; i <= totalPage; i++) {
          routes.push(`/news/page/${i}`);
        }
      }
      if (resData.totalPage > resData.currentPage) {
        const nextPaths = await getArticleListRoutes(page + 1, apiHost, isPro);
        routes = routes.concat(nextPaths);
      }
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request news article list failed, ${error}`);
    return [];
  }
}

async function getHomeTabs(apiHost, isPro) {
  try {
    const routes = [];
    const zoneApi = `${apiHost}/_api/${prefix}/web/zone/list?lang=en_US`;
    const resData = await request(zoneApi);
    if (resData && resData.success && resData.items) {
      const zoneList = resData.items;
      for (let i = 0; i < zoneList.length; i++) {
        const code = zoneList[i]?.zoneCode;
        const zoneInfoApi = `${apiHost}/_api/${prefix}/web/article/page?lang=en_US&page=1&pageSize=${HomeTabPageShowSize}&zoneLv2Code=${code}`;
        const zoneResData = await request(zoneInfoApi);
        if (zoneResData && zoneResData.success) {
          const totalPage = zoneResData.totalPage || 1;
          routes.push(`/news/category/${code}`);
          for (let i = 2; i <= totalPage; i++) {
            routes.push(`/news/category/${code}/page/${i}`);
          }
        }
      }
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request news tab list failed, ${error}`);
    return [];
  }
}

const getNewsRoutesWithOutLang = async (apiHost, isPro) => {
  const staticRoutes = ['/news', '/news/topics'];
  const topicBanner = await getTopicBannerRoutes(apiHost, isPro);
  const topicList = await getTopicListRoutes(1, apiHost, isPro);
  const tagList = await getTagRoutes(apiHost, isPro);
  // 文章详情页 & 翻页(首页 ALL)路由
  const articleList = await getArticleListRoutes(1, apiHost, isPro);
  // 首页tab(除了 ALL tab) 翻页路由
  const homeTabs = await getHomeTabs(apiHost, isPro);
  return [
    ...staticRoutes,
    ...topicBanner,
    ...topicList,
    ...tagList,
    ...articleList,
    ...homeTabs,
  ];
};

module.exports = {
  getNewsRoutesWithOutLang,
};
