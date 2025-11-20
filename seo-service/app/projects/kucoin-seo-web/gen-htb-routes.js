/**
 * 获取 kucoin-seo-web 所有 how-to-buy 路由
 * Owner: hanx.wei@kupotech.com
 */
const { request } = require('urllib');
const asyncLib = require('async');
const { USE_SERVERLESS } = require('@scripts/config');
const logger = require('@app/worker/logger');
const decreaseRoutes = require('@utils/decrease-routes');

const REQUEST_API = '/_api/quicksilver/universe-currency/currency-base-info-page';
const PAGE_SIZE = 100;

async function requestHowToBuyCoins(host, pageIndex) {
  const api = `${host}${REQUEST_API}?pageIndex=${pageIndex}&pageSize=${PAGE_SIZE}`;
  try {
    const result = await request(api, {
      contentType: 'application/json',
      dataType: 'json',
    });
    if (result.statusCode !== 200) {
      throw new Error(`Request ${api} failed, code ${result.statusCode}`);
    }
    const data = result.data.data;
    const coins = data.items.map(({ jumpSuffix }) => jumpSuffix.trim());
    const totalPage = data.totalPage;
    return { totalPage, coins };
  } catch (err) {
    logger.error(`Request how-to-buy ${api} error`, err);
    return { totalPage: 0, coins: [] };
  }
}

function genHowToBuyDetailRoute(coin) {
  const coinName = coin.toLowerCase().replace(/\s/g, '-');
  return `/how-to-buy/${coinName}`;
}

module.exports = async function() {
  logger.debug(`get how-to-buy routes for ${this.host}${this.entry}`);
  const firstPageCoins = await requestHowToBuyCoins(this.apiHost, 1);
  let routes = [ '/how-to-buy' ];
  firstPageCoins.coins.forEach(coin => {
    routes.push(genHowToBuyDetailRoute(coin));
  });
  if (firstPageCoins.totalPage > 1) {
    // pageIndex 从 2 开始
    const pageIndexes = [];
    for (let i = 2; i <= firstPageCoins.totalPage; i++) {
      pageIndexes.push(i);
    }
    // 控制并发数量为 5 个
    await new Promise(resolve => {
      asyncLib.mapLimit(pageIndexes, 5, async pageIndex => {
        const ret = await requestHowToBuyCoins(this.apiHost, pageIndex);
        return ret;
      }, (err, results) => {
        if (!err) {
          results.forEach(ret => {
            ret.coins.forEach(coin => {
              routes.push(genHowToBuyDetailRoute(coin));
            });
          });
        }
        resolve();
      });
    });
  }
  if (!this.configs.IS_PRO_ENV) {
    const lastPage = routes[routes.length - 1]; // 最后一个通常是临时币种
    const decreasedRoutes = decreaseRoutes(routes);
    if (decreasedRoutes.includes(lastPage)) {
      routes = decreasedRoutes;
    } else {
      routes = [ ...decreasedRoutes, lastPage ];
    }
  }
  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'how-to-buy',
    priority: 2,
    withoutLang: [],
    withLang: null,
    isApp: false,
    themes: [ THEME_DEFAULT ],
    useServerless: USE_SERVERLESS,
  };
  return this.stopFlag ? routesInfo : {
    ...routesInfo,
    withoutLang: routes,
  };
};
