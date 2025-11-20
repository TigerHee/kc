/**
 * 获取 trade-public-web 静态路由
 * Owner: jessie@kupotech.com
 */
const logger = require('@app/worker/logger');

const staticRoutes = [
  '/markets',
  // '/markets/favorite',
  '/markets/new-cryptocurrencies',
  '/markets/hot-cryptocurrencies',
  '/api',
  '/vip/privilege',
  '/broker',
  '/institution',
  '/institution/borrow',
  '/institution/marketMaker',
  // 以下是代码里写死的
  // --------- 全部币种 start----------
  '/markets/infrastructure',
  '/markets/payments',
  '/markets/memes',
  '/markets/solana-ecosystem',
  '/markets/defi',
  '/markets/web3',
  '/markets/kcc-ecosystem',
  '/markets/kucoin-features',
  '/markets/nft',
  '/markets/sports-coins',
  '/markets/cosmos-ecosystem',
  '/markets/metaverse',
  '/markets/gaming',
  '/markets/terra-ecosystem',
  // --------- 全部币种 end----------
  // 现货指数
  '/markets/spot/spot_index',
  // --------- 全部ranking end----------
  '/markets/rankings',
  '/markets/rankings/trending',
  '/markets/rankings/gainers',
  '/markets/rankings/losers',
  '/markets/rankings/volume',
  '/markets/rankings/new',
  '/markets/rankings/hot',
  // --------- 全部ranking end----------
];

module.exports = async function() {
  logger.debug(`start get default routes for ${this.host}${this.entry}`);
  const { THEME_DEFAULT, THEME_DARK } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'default',
    priority: 1,
    withoutLang: [],
    withLang: null,
    isApp: false,
    themes: [THEME_DEFAULT, THEME_DARK],
  };
  return this.stopFlag
    ? routesInfo
    : {
      ...routesInfo,
      withoutLang: staticRoutes,
    };
};
