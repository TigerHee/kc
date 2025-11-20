/**
 * 获取 kucoin-seo-web 所有 learn 路由
 * Owner: kevyn.yu@kupotech.com
 */
const { request } = require('urllib');
const { USE_SERVERLESS } = require('@scripts/config');
const logger = require('@app/worker/logger');
const { flatMapDeep } = require('lodash');
const { newToOld } = require('@scripts/langs/new');
const decreaseRoutes = require('@utils/decrease-routes');
const REQUEST_API = '/_api/seo-front/category/details/list';
const CATEGORY_API = '/_api/seo-front/toc/topic/name';
const CLASSIFY_API = '/_api/seo-front/homepage/classify-show';
const TOPIC_API = '/_api/seo-front/topic-show';
const GLOSSARY_API = '/_api/seo-front/category/glossary';
const FEATURED_API = '/_api/seo-front/category/details/article/get';

const PAGE_SIZE = 100;
const CLASSIFY_ENUM = {
  12: 'trading',
  13: 'crypto',
  14: 'web3',
};

// 获取专题文章
async function requestFeaturedArticle(host, type, lang) {
  const api = `${host}${FEATURED_API}?classify=${type}&lang=${
    newToOld[lang] || 'en_US'
  }`;
  try {
    const result = await request(api, {
      contentType: 'application/json',
      dataType: 'json',
      headers: {
        LANG: newToOld[lang],
      },
    });
    if (result.statusCode !== 200) {
      throw new Error(`Request ${api} failed, code ${result.statusCode}`);
    }
    if (result.data.success && result.data.data) {
      return result.data.data.articleUrl;
    }
    return '';
  } catch (err) {
    logger.error(`Request learn ${api} error`, err);
    return '';
  }
}

async function getFeaturedArticle(lang) {
  const types = Object.entries(CLASSIFY_ENUM).map(([, val]) => val);
  const routes = [];
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    const url = await requestFeaturedArticle(this.apiHost, type, lang);
    if (url) {
      const langPath = lang === 'en' ? '/learn' : `/${lang}/learn`;
      const articleUrl = langPath + url?.split('/learn')[1];
      routes.push(articleUrl);
    }
  }
  return { lang, routes };
}

// 获取显示的分类
async function getClassify(host, type, lang) {
  const api = `${host}${CLASSIFY_API}?classifies=${type}`;
  try {
    const result = await request(api, {
      contentType: 'application/json',
      dataType: 'json',
      headers: {
        LANG: newToOld[lang],
      },
    });
    if (result.statusCode !== 200) {
      throw new Error(`Request ${api} failed, code ${result.statusCode}`);
    }
    const data = result.data.data || [];
    return data;
  } catch (err) {
    logger.error(`Request learn ${api} error`, err);
    return [];
  }
}

// 获取显示的topic/course
async function getTopic(host, type, lang, cate) {
  const api = `${host}${TOPIC_API}?${cate}=${type}`;
  try {
    const result = await request(api, {
      contentType: 'application/json',
      dataType: 'json',
      headers: {
        LANG: newToOld[lang],
      },
    });
    if (result.statusCode !== 200) {
      throw new Error(`Request ${api} failed, code ${result.statusCode}`);
    }
    const data = result.data.data || [];
    return data;
  } catch (err) {
    logger.error(`Request learn ${api} error`, err);
    return [];
  }
}

// 获取分类/topic/crash-course
async function getNavItems(host, type, lang) {
  const api = `${host}${CATEGORY_API}?type=${type}`;
  try {
    const result = await request(api, {
      contentType: 'application/json',
      dataType: 'json',
      headers: {
        LANG: newToOld[lang],
      },
    });
    if (result.statusCode !== 200) {
      throw new Error(`Request ${api} failed, code ${result.statusCode}`);
    }
    const data = result.data.data || [];
    return data;
  } catch (err) {
    logger.error(`Request learn ${api} error`, err);
    return [];
  }
}
async function getCategories(host, lang) {
  const classifyRes = Object.keys(CLASSIFY_ENUM).map(i => ({
    name: i,
    topicsEnglishName: CLASSIFY_ENUM[i],
  }));

  const classify = await getClassify(
    host,
    Object.keys(CLASSIFY_ENUM).join(','),
    lang
  );

  const [topicRes, courseRes] = await Promise.allSettled([
    getNavItems(host, 'topic', lang),
    getNavItems(host, 'course', lang),
  ]);
  const result = {};
  result.classify = classifyRes?.filter(i =>
    classify?.find(item => +item === +i?.name)
  );
  if (topicRes.status === 'fulfilled') {
    const topic = await getTopic(
      host,
      topicRes.value?.map(i => i?.topicsEnglishName).join(','),
      lang,
      'topics'
    );
    result.topic = topicRes.value?.filter(i =>
      topic?.find(item => item === i?.topicsEnglishName)
    );
  } else {
    result.topic = [];
  }

  if (courseRes.status === 'fulfilled') {
    const course = await getTopic(
      host,
      courseRes.value?.map(i => i?.topicsEnglishName).join(','),
      lang,
      'course'
    );
    result.course = courseRes.value?.filter(i =>
      course?.find(item => item === i?.topicsEnglishName)
    );
  } else {
    result.course = [];
  }

  return result;
}

// 获取文章列表
async function requestArticles(host, lang, queryObj) {
  if (!queryObj.lang) {
    queryObj.lang = newToOld[lang] || 'en_US';
  }
  const params = new URLSearchParams(queryObj);
  const queryStr = params.toString();
  const api = `${host}${REQUEST_API}?${queryStr}`;
  try {
    const result = await request(api, {
      contentType: 'application/json',
      dataType: 'json',
      headers: {
        LANG: newToOld[lang],
      },
    });
    if (result.statusCode !== 200) {
      throw new Error(`Request ${api} failed, code ${result.statusCode}`);
    }
    const langPath = lang === 'en' ? '/learn' : `/${lang}/learn`;
    const items = result.data?.data?.items || [];
    const total = result.data?.data?.total || 0;
    const pageSize = result.data?.data?.pageSize || 1;
    const articles = items.map(
      ({ articleUrl }) => langPath + articleUrl?.split('/learn')[1]
    );
    const totalPage = Math.ceil(total / pageSize) || 0;
    return { totalPage, articles, total };
  } catch (err) {
    logger.error(`Request learn ${api} error`, err);
    return { totalPage: 0, articles: [], total: 0 };
  }
}

// 获取分类详情页的分页路由
async function getClassifyDetailPagedRoutes(classify, lang) {
  const { topicsEnglishName } = classify;
  const firstPage = await requestArticles(this.apiHost, lang, {
    pageIndex: 1,
    classify: topicsEnglishName,
    pageSize: 9,
  });
  const langPath = lang === 'en' ? '/learn' : `/${lang}/learn`;
  const routes = [`${langPath}/${topicsEnglishName}`];
  if (firstPage.totalPage >= 2) {
    for (let i = 2; i <= firstPage.totalPage; i++) {
      routes.push(`${langPath}/${topicsEnglishName}/page/${i}`);
    }
  }
  if (!this.configs.IS_PRO_ENV) {
    const decreasedRoutes = decreaseRoutes(routes, { count: 5 });
    return { lang, routes: decreasedRoutes };
  }
  return { lang, routes };
}
// 获取分类下所有文章的路由
async function getClassifyArticleRoutes(classify, lang) {
  const { name, topicsEnglishName } = classify;
  const firstPage = await requestArticles(this.apiHost, lang, {
    pageIndex: 1,
    classify: topicsEnglishName,
    pageSize: PAGE_SIZE,
  });
  if (!this.configs.IS_PRO_ENV) {
    const decreasedArticles = decreaseRoutes(firstPage.articles, { count: 10 });
    return { lang, routes: decreasedArticles };
  }
  // 只有第一页直接返回
  if (firstPage.totalPage < 2) return { lang, routes: firstPage.articles };
  const pages = [];
  for (let i = 2; i <= firstPage.totalPage; i++) {
    pages.push(i);
  }
  const leftPages = await Promise.allSettled(
    pages.map(pageIndex => {
      return requestArticles(this.apiHost, lang, {
        pageIndex,
        classify: name,
        pageSize: PAGE_SIZE,
      });
    })
  );
  const articles = leftPages.reduce(
    (prev, cur) =>
      (cur.status === 'fulfilled' ? [...prev, ...cur.value.articles] : prev),
    []
  );
  return { lang, routes: [...firstPage.articles, ...articles] };
}

// topic 文章列表页
async function getTopicPagedRoutes(topic, lang) {
  const { topicsEnglishName } = topic;
  const firstPage = await requestArticles(this.apiHost, lang, {
    pageIndex: 1,
    // URLSearchParams 无法将 topics:[topicsEnglishName] 转换为 topics[0]=topicsEnglishName
    'topics[0]': topicsEnglishName,
    pageSize: PAGE_SIZE,
  });
  const langPath = lang === 'en' ? '/learn/topics' : `/${lang}/learn/topics`;
  // topic类型下的文章会和其他的分类的文章存在重复
  const routes = [`${langPath}/${topicsEnglishName}`, ...firstPage.articles];
  const totalPage = Math.ceil(firstPage.total / 9) || 0;
  if (totalPage >= 2) {
    for (let i = 2; i <= totalPage; i++) {
      routes.push(`${langPath}/${topicsEnglishName}/page/${i}`);
    }
  }
  if (!this.configs.IS_PRO_ENV) {
    const decreasedRoutes = decreaseRoutes(routes, { count: 5 });
    return { lang, routes: decreasedRoutes };
  }
  // 翻页获取文章数据
  if (firstPage.totalPage < 2) return { lang, routes };
  const pages = [];
  for (let i = 2; i <= firstPage.totalPage; i++) {
    pages.push(i);
  }
  const leftPages = await Promise.allSettled(
    pages.map(pageIndex => {
      return requestArticles(this.apiHost, lang, {
        pageIndex,
        'topics[0]': topicsEnglishName,
        pageSize: PAGE_SIZE,
      });
    })
  );
  const articles = leftPages.reduce(
    (prev, cur) =>
      (cur.status === 'fulfilled' ? [...prev, ...cur.value.articles] : prev),
    []
  );
  return { lang, routes: [...routes, ...articles] };
}

// 获取 crash-course 文章列表页和所有文章的路由
async function getCrashCoursesRoutes(course, lang) {
  const { topicsEnglishName } = course;
  const firstPage = await requestArticles(this.apiHost, lang, {
    pageIndex: 1,
    course: topicsEnglishName,
    pageSize: PAGE_SIZE,
  });
  const indexPage =
    lang === 'en'
      ? `/learn/crash-courses/${topicsEnglishName}`
      : `/${lang}/learn/crash-courses/${topicsEnglishName}`;
  if (!this.configs.IS_PRO_ENV) {
    const decreasedArticles = decreaseRoutes(firstPage.articles, { count: 10 });
    return { lang, routes: [indexPage, ...decreasedArticles] };
  }
  // 只有第一页直接返回
  if (firstPage.totalPage < 2) {
    return { lang, routes: [indexPage, ...firstPage.articles] };
  }
  const pages = [];
  for (let i = 2; i <= firstPage.totalPage; i++) {
    pages.push(i);
  }
  const leftPages = await Promise.allSettled(
    pages.map(pageIndex => {
      return requestArticles(this.apiHost, lang, {
        pageIndex,
        classify: name,
        pageSize: PAGE_SIZE,
      });
    })
  );
  const articles = leftPages.reduce(
    (prev, cur) =>
      (cur.status === 'fulfilled' ? [...prev, ...cur.value.articles] : prev),
    []
  );
  return { lang, routes: [indexPage, ...firstPage.articles, ...articles] };
}

// 获取 glossary 文章页面
async function getGlossaryRoutes(lang) {
  const api = `${this.apiHost}${GLOSSARY_API}?page=1&pageSize=50&lang=${newToOld[lang]}`; // 目前没有分页，但是必须传 pageSize
  const langPath = lang === 'en' ? '/learn' : `/${lang}/learn`;
  const indexPage = `${langPath}/glossary`;
  try {
    const result = await request(api, {
      contentType: 'application/json',
      dataType: 'json',
      headers: {
        LANG: newToOld[lang],
      },
    });
    if (result.statusCode !== 200) {
      throw new Error(`Request ${api} failed, code ${result.statusCode}`);
    }
    const items = result.data?.data?.items || [];
    const articles = items.map(
      ({ articleUrl }) => langPath + articleUrl?.split('/learn')[1]
    );
    if (!this.configs.IS_PRO_ENV) {
      const decreasedArticles = decreaseRoutes(articles, { count: 10 });
      return { lang, routes: [indexPage, ...decreasedArticles] };
    }
    return { lang, routes: [indexPage, ...articles] };
  } catch (err) {
    logger.error(`Request learn ${api} error`, err);
    return { lang, routes: [indexPage] };
  }
}

module.exports = async function(langs) {
  logger.debug(`get learn routes for ${this.host}${this.entry}`);

  const withLangRoutes = {};
  for (const lang of langs) {
    const categories = await getCategories(this.apiHost, lang);
    const results = await Promise.allSettled(
      flatMapDeep([
        getFeaturedArticle.call(this, lang),
        categories.classify.map(classify => [
          getClassifyDetailPagedRoutes.call(this, classify, lang),
          getClassifyArticleRoutes.call(this, classify, lang),
        ]),
        categories.topic.map(topic => {
          return getTopicPagedRoutes.call(this, topic, lang);
        }),
        categories.course.map(course => {
          return getCrashCoursesRoutes.call(this, course, lang);
        }),
        getGlossaryRoutes.call(this, lang),
      ])
    );
    const routes = results.reduce((prev, cur) => {
      if (cur.status === 'fulfilled' && cur.value?.lang) {
        prev.push(...(cur.value?.routes ?? []));
      }
      // topic类型下的文章会和其他的分类的文章存在重复
      return Array.from(new Set(prev));
    }, []);
    const indexRoute = `${lang === 'en' ? '/learn' : `/${lang}/learn`}`;
    withLangRoutes[lang] = [indexRoute, ...routes];
  }

  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'learn',
    priority: 3,
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
      withLang: withLangRoutes,
    };
};
