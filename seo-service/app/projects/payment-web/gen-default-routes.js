/**
 * 获取 payment-web 静态路由
 * Owner: jerry.shen@flashdot.com
 */
const logger = require('@app/worker/logger');

const listType = ['buy', 'sell'];
const cryptoCurrencyList = ['USDT', 'BTC', 'ETH', 'KCS', 'USDC'];
let fiatCurrencyList = [
  'USD',
  'AED',
  'ARS',
  'AUD',
  'BDT',
  'BRL',
  'CAD',
  'COP',
  'DZD',
  'EGP',
  'EUR',
  'GBP',
  'GHS',
  'IDR',
  'INR',
  'JPY',
  'KES',
  'KRW',
  'KWD',
  'KZT',
  'LAK',
  'MAD',
  'MXN',
  'MYR',
  'NGN',
  'NPR',
  'PHP',
  'PKR',
  'PLN',
  'RUB',
  'SAR',
  'THB',
  'TRY',
  'TWD',
  'TZS',
  'UAH',
  'VES',
  'VND',
  'ZAR',
];
// 线下及预发执行数量减少
if (process.env.serverEnv !== 'pro') {
  fiatCurrencyList = ['USD', 'EUR'];
}

const staticRoutes = [];
for (const buyType of listType) {
  for (const crypto of cryptoCurrencyList) {
    for (const fiat of fiatCurrencyList) {
      staticRoutes.push(`/otc/${buyType}/${crypto}-${fiat}`);
    }
  }
}

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
