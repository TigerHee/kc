/**
 * Owner: ella.wang@kupotech.com
 */
const request = require('@utils/request');
const decreaseRoutes = require('@utils/decrease-routes');
const zElanguages = require('@scripts/langs/zElanguages.js');
const { newToOld } = require('@scripts/langs/new');
const logger = require('@app/worker/logger');

const PAGE_SIZE = 100;
const OPTION = { count: 5 };

const CURRENCY_LIST_API =
  '/_api/quicksilver/universe-currency/currency-list-page';
const SPOT_TRADING_API = '/_api/currency/symbols';
const FUTURES_TRADING_API =
  '/_api_kumex/kumex-contract/contracts/active?preview=false';
const SPOT_GRID_API = '/_api_robot/cloudx-scheduler/professional/web/tick';
const FUTURES_GRID_API =
  '/_api_robot/cloudx-scheduler/professional/web/futures/symbols';
const MARTINGALE_API =
  '/_api_robot/cloudx-scheduler/professional/web/tick?templateType=7';
const INFINITY_GRID_API =
  '/_api_robot/cloudx-scheduler/professional/web/tick?templateType=5';
const DCA_API = '/_api_robot/cloudx-scheduler/v1/aip/task/v2/symbol';
const NEWS_API = `/_api/cms/articles?page=1&pageSize=${PAGE_SIZE}`;
const BLOG_API = `/_api/cms/articles?page=1&pageSize=${PAGE_SIZE}&type=${3}`;

const getTotalPages = (pageSize, totalNum) => {
  const totalPages = Math.ceil(totalNum / pageSize);
  const pages = [];
  for (let page = 1; page <= totalPages; page++) {
    pages.push(page);
  }
  return pages;
};

const getAllSymbolsTotal = (param = {}) => {
  const { data, success } = param;
  if (success && data) {
    let symbols = [];
    Object.entries(data.symbol).forEach(([, val]) => {
      symbols = symbols.concat(val);
    });
    return symbols.length;
  }
  return 0;
};

const getCryptoRoutes = async (apiHost, isPro) => {
  try {
    const params = {
      pageIndex: 1,
      pageSize: PAGE_SIZE,
      sortField: 'cap',
      sortType: 'desc',
      dataSource: 'Kucoin',
    };
    const routes = [];
    const queryObj = new URLSearchParams(params);
    const queryStr = queryObj.toString();
    const api = `${apiHost}${CURRENCY_LIST_API}?${queryStr}`;
    const data = await request(api);
    if (data && data.success && data.data) {
      const { totalNum } = data.data;
      const totalPages = getTotalPages(PAGE_SIZE, totalNum);
      totalPages.forEach(page => {
        routes.push(`/sitemap/crypto/${page}`);
      });
    }
    if (data && (Number(data.code) !== 200 || !data.success)) {
      logger.error(`Request ${api} failed, code ${data.code}`);
    }
    if (routes.length === 0) {
      return ['/sitemap/crypto/1'];
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request sitemap failed, ${error}`);
    return ['/sitemap/crypto/1'];
  }
};

const getSpotTradingRoutes = async (apiHost, isPro) => {
  try {
    const routes = [];
    const api = `${apiHost}${SPOT_TRADING_API}`;
    const data = await request(api);
    if (data && data.success && data.data) {
      const totalNum = data.data.length;
      const totalPages = getTotalPages(PAGE_SIZE, totalNum);
      totalPages.forEach(page => {
        routes.push(`/sitemap/spot-trading/${page}`);
      });
    }
    if (data && (Number(data.code) !== 200 || !data.success)) {
      logger.error(`Request ${api} failed, code ${data.code}`);
    }
    if (routes.length === 0) {
      return ['/sitemap/spot-trading/1'];
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request sitemap failed, ${error}`);
    return ['/sitemap/spot-trading/1'];
  }
};

const getFuturesTradeRoutes = async (apiHost, isPro) => {
  try {
    const routes = [];
    const api = `${apiHost}${FUTURES_TRADING_API}`;
    const data = await request(api);
    if (data && data.success && data.data) {
      const totalNum = data.data.length;
      const totalPages = getTotalPages(PAGE_SIZE, totalNum);
      totalPages.forEach(page => {
        routes.push(`/sitemap/futures-trading/${page}`);
      });
    }
    if (data && (Number(data.code) !== 200 || !data.success)) {
      logger.error(`Request ${api} failed, code ${data.code}`);
    }
    if (routes.length === 0) {
      return ['/sitemap/futures-trading/1'];
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request sitemap failed, ${error}`);
    return ['/sitemap/futures-trading/1'];
  }
};

const getSpotGridRoutes = async (apiHost, isPro) => {
  try {
    const routes = [];
    const api = `${apiHost}${SPOT_GRID_API}`;
    const data = await request(api);
    if (data && (Number(data.code) !== 200 || !data.success)) {
      logger.error(`Request ${api} failed, code ${data.code}`);
    } else {
      const totalNum = getAllSymbolsTotal(data);
      const totalPages = getTotalPages(PAGE_SIZE, totalNum);
      totalPages.forEach(page => {
        routes.push(`/sitemap/spot-grid/${page}`);
      });
    }
    if (routes.length === 0) {
      return ['/sitemap/spot-grid/1'];
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request sitemap failed, ${error}`);
    return ['/sitemap/spot-grid/1'];
  }
};

const getFuturesGridRotes = async (apiHost, isPro) => {
  const api = `${apiHost}${FUTURES_GRID_API}`;
  try {
    const routes = [];
    const data = await request(api);
    if (data && data.success && data.data) {
      const list = data.data.all || [];
      const totalNum = list.length;
      const totalPages = getTotalPages(PAGE_SIZE, totalNum);
      totalPages.forEach(page => {
        routes.push(`/sitemap/futures-grid/${page}`);
      });
    }
    if (data && !data.success) {
      logger.error(`Request ${api} failed, code ${data.code}`);
    }
    if (routes.length === 0) {
      return ['/sitemap/futures-grid/1'];
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request sitemap failed, ${api}`);
    return ['/sitemap/futures-grid/1'];
  }
};

const getMartingaleRoutes = async (apiHost, isPro) => {
  try {
    const routes = [];
    const api = `${apiHost}${MARTINGALE_API}`;
    const data = await request(api);
    if (data && (Number(data.code) !== 200 || !data.success)) {
      logger.error(`Request ${api} failed, code ${data.code}`);
    } else {
      const totalNum = getAllSymbolsTotal(data);
      const totalPages = getTotalPages(PAGE_SIZE, totalNum);
      totalPages.forEach(page => {
        routes.push(`/sitemap/martingale/${page}`);
      });
    }
    if (routes.length === 0) {
      return ['/sitemap/martingale/1'];
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request sitemap failed, ${error}`);
    return ['/sitemap/martingale/1'];
  }
};

const getInfinityGridRoutes = async (apiHost, isPro) => {
  try {
    const routes = [];
    const api = `${apiHost}${INFINITY_GRID_API}`;
    const data = await request(api);
    if (data && (Number(data.code) !== 200 || !data.success)) {
      logger.error(`Request ${api} failed, code ${data.code}`);
    } else {
      const totalNum = getAllSymbolsTotal(data);
      const totalPages = getTotalPages(PAGE_SIZE, totalNum);
      totalPages.forEach(page => {
        routes.push(`/sitemap/infinity-grid/${page}`);
      });
    }
    if (routes.length === 0) {
      return ['/sitemap/infinity-grid/1'];
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request sitemap failed, ${error}`);
    return ['/sitemap/infinity-grid/1'];
  }
};

const getDcaRoutes = async (apiHost, isPro) => {
  try {
    const routes = [];
    const api = `${apiHost}${DCA_API}`;
    const data = await request(api);
    if (data && data.success && data.data) {
      const list = data.data.allSymbol || [];
      const totalNum = list.length;
      const totalPages = getTotalPages(PAGE_SIZE, totalNum);
      totalPages.forEach(page => {
        routes.push(`/sitemap/dca/${page}`);
      });
    }
    if (data && (Number(data.code) !== 200 || !data.success)) {
      logger.error(`Request ${api} failed, code ${data.code}`);
    }
    if (routes.length === 0) {
      return ['/sitemap/dca/1'];
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request sitemap failed, ${error}`);
    return ['/sitemap/dca/1'];
  }
};

const getNewsRoutes = async (apiHost, lang, langPath, isPro) => {
  const pathWithLang = langPath === 'en' ? '' : `/${langPath}`;
  try {
    const routes = [];
    const api = `${apiHost}${NEWS_API}&lang=${lang}`;
    const data = await request(api);
    if (data && data.success && data.items) {
      const totalNum = data.totalNum;
      const totalPages = getTotalPages(PAGE_SIZE, totalNum);
      totalPages.forEach(page => {
        routes.push(`${pathWithLang}/sitemap/announcement/${page}`);
      });
    }
    if (data && (Number(data.code) !== 200 || !data.success)) {
      logger.error(`Request ${api} failed, code ${data.code}`);
    }
    if (routes.length === 0) {
      return [`${pathWithLang}/sitemap/announcement/1`];
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request sitemap failed, ${error}`);
    return [`${pathWithLang}/sitemap/announcement/1`];
  }
};

const getBlogsRoutes = async (apiHost, lang, langPath, isPro) => {
  const pathWithLang = langPath === 'en' ? '' : `/${langPath}`;
  try {
    const routes = [];
    const api = `${apiHost}${BLOG_API}&lang=${lang}`;
    const data = await request(api);
    if (data && data.success && data.items) {
      const totalNum = data.totalNum;
      const totalPages = getTotalPages(PAGE_SIZE, totalNum);
      totalPages.forEach(page => {
        routes.push(`${pathWithLang}/sitemap/blogs/${page}`);
      });
    }
    if (data && (Number(data.code) !== 200 || !data.success)) {
      logger.error(`Request ${api} failed, code ${data.code}`);
    }
    if (routes.length === 0) {
      return [`${pathWithLang}/sitemap/blogs/1`];
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request sitemap failed, ${error}`);
    return [`${pathWithLang}/sitemap/blogs/1`];
  }
};

const getSupportRoutes = async (apiHost, lang, langPath, isPro) => {
  const pathWithLang = langPath === 'en' ? '' : `/${langPath}`;
  const requestLang = zElanguages[lang] || 'en-us';
  const api = `${apiHost}/_api/support/api/v2/help_center/${requestLang}/articles.json?per_page=${PAGE_SIZE}&page=1`;
  try {
    const routes = [];
    const data = await request(api);
    const content = data?.data || {};
    if (data && data.success && content.articles) {
      const totalNum = content.count;
      const totalPages = getTotalPages(PAGE_SIZE, totalNum);
      totalPages.forEach(page => {
        routes.push(`${pathWithLang}/sitemap/support/${page}`);
      });
    }
    if (data && !data.success) {
      logger.error(`Request ${api} failed, ${data}`);
    }
    if (routes.length === 0) {
      return [`${pathWithLang}/sitemap/support/1`];
    }
    if (!isPro) {
      return decreaseRoutes(routes, OPTION);
    }
    return routes;
  } catch (error) {
    logger.error(`Request sitemap failed, ${api}`);
    return [`${pathWithLang}/sitemap/support/1`];
  }
};

const getSitemapRoutesWithOutLang = async (apiHost, isPro) => {
  try {
    const cryptoRoutes = await getCryptoRoutes(apiHost, isPro);
    const spotTradingRoutes = await getSpotTradingRoutes(apiHost, isPro);
    const futuresTradeRoutes = await getFuturesTradeRoutes(apiHost, isPro);
    const spotGridRoutes = await getSpotGridRoutes(apiHost, isPro);
    const futuresGridRotes = await getFuturesGridRotes(apiHost, isPro);
    const martingaleRoutes = await getMartingaleRoutes(apiHost, isPro);
    const infinityGridRoutes = await getInfinityGridRoutes(apiHost, isPro);
    const dcaRoutes = await getDcaRoutes(apiHost, isPro);
    return [
      ...cryptoRoutes,
      ...spotTradingRoutes,
      ...futuresTradeRoutes,
      ...spotGridRoutes,
      ...futuresGridRotes,
      ...martingaleRoutes,
      ...infinityGridRoutes,
      ...dcaRoutes,
    ];
  } catch (error) {
    logger.error('getSitemapRoutesWithOutLang failed');
    return [];
  }
};

const getSitemapRoutesWithLang = async (apiHost, langs, isPro) => {
  try {
    const routesMap = {};
    if (Array.isArray(langs)) {
      for (const lang of langs) {
        const langParam = newToOld[lang];
        const newsRoutes = await getNewsRoutes(apiHost, langParam, lang, isPro);
        const blogsRoutes = await getBlogsRoutes(
          apiHost,
          langParam,
          lang,
          isPro
        );
        const supportRoutes = await getSupportRoutes(
          apiHost,
          langParam,
          lang,
          isPro
        );
        routesMap[lang] = [...newsRoutes, ...blogsRoutes, ...supportRoutes];
      }
    }
    return routesMap;
  } catch (error) {
    logger.error('getSitemapRoutesWithLang failed');
    return null;
  }
};

module.exports = {
  getSitemapRoutesWithOutLang,
  getSitemapRoutesWithLang,
};
