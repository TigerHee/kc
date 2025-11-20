/**
 * Owner: willen@kupotech.com
 */

// 页面与标识参数文档：https://k-devdoc.atlassian.net/wiki/spaces/cpzx/pages/286886371
// 若需新增路由联系Leon Yang更新到上面的文档中
// 支持一个scene对多个路由，如：otc_list: ['/otc/buy/:coinLegal', '/otc/sell/:coinLegal']
export const ROUTE_BIZ_SCENE = {
  homepage: '/',
  convert: '/convert',
  account: '/account',
  futures_trading: '/futures/trade/:symbol',
  trading_bot: '/trading-bot/:type/:strategy?/:pair?',
  nft_intro: '/nft-token/intro',
  spotlight: '/spotlight-center',
  nft_main: '/spot-nft/main',
  nft_sell: '/spot-nft/token-sell/:currency/:index',
  nft_project: '/spot-nft/project/:id/:index/:type',
  market_new: '/markets/new-cryptocurrencies',
  market: '/markets',
  assets_recharge: '/assets/fiat-currency/recharge',
  assets_withdraw: '/assets/fiat-currency/withdraw',
  assets_deposit: '/assets/coin',
  assets_third: '/assets/payments',
  assets_overview: '/assets',
  otc_orders: '/otc/user/orders',
  otc_payments: '/otc/user/payments',
  otc_list: ['/otc/buy/:coinLegal', '/otc/sell/:coinLegal'],
  express_merchant: '/express/merchant',
  express_homepage: '/express',
  trade: '/trade',
  signup: '/ucenter/signup',
  api: '/api',
  pre_market: '/pre-market',
  futures_lite: '/futures/lite',
  futures_bonus: '/futures/bonus',
  futures_intro: '/futures',
  leveraged: '/leveraged-tokens',
  v2_lend: '/margin/v2/lend',
  wealth_home: '/wealth/home',
  institution_borrow: '/institution/borrow',
  earn_convertplus: '/earn/convert-plus',
  earn_kcs: '/earn/kcs',
  earn_dual: '/earn/dual',
  twin_win: '/earn/twin-win',
  future_plus: '/earn/future-plus',
  range_bound: '/earn/range-bound',
  earn_savings: '/earn/savings',
  earn_staking: '/earn/staking',
  earn_promotion: '/earn/promotion',
  earn_sharkfin: '/earn/shark-fin',
  earn_snowball: '/earn/snowball',
  earn: '/earn',
};

// 需要展示新增封禁弹窗的页面（仅游客）
export const SUPPORT_REGISTER_DIALOG_RESTRICT = [
  '/ucenter/signup', // 注册页
];

// 需要展示IP封禁弹窗的页面（全用户）
export const SUPPORT_IP_DIALOG_ROUTE = [
  '/', // 首页
  '/markets', // 行情页
];

// 需要展示强制KYC的弹窗的页面（仅登录）
export const SUPPORT_FORCE_KYC_DIALOG_ROUTE = [
  '/account', // 用户概览页
];

// 需要展示自动化清退弹窗的页面（仅登录）
export const SUPPORT_CLEARANCE_DIALOG_ROUTE = [
  '/', // 首页
  '/assets', // 资产概览页
  '/account', // 用户概览页
];

// 需要展示信息审核弹窗的页面（仅登录）
export const SUPPORT_EXAMINE_DIALOG_ROUTE = [
  '/account', // 用户概览页
];

// 英国地区特殊弹窗
export const ENGLAND_DIALOG_ROUTE = [
  '/', // 首页
];
// 用户迁移特殊弹窗
export const ACCOUNT_TRANSFER_HOMEPAGE_DIALOG_ROUTE = [
  '/', // 首页
];
export const ACCOUNT_TRANSFER_DIALOG_ROUTE = [
  /\/futures.*/, // 期货页及其子页
  /\/trade\/futures.*/, // 合同页及其子页
  // /\/option-simple.*/,
  /\/assets\/futures-account.*/, // 资产业务及其子页
];
