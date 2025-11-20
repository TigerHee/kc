/**
 * Owner: iron@kupotech.com
 */
const v2ApiHosts = {
  CMS: 'http://localhost:2999/next-web/_api',
  WEB: 'http://localhost:2999/next-web/_api',
};

const HOST = {
  'MAIN_HOST': 'https://www.kucoin.net',
  'MAIN_HOST_CN': 'https://www.kucoin.top',
  'MAIN_HOST_COM': 'https://www.kucoin.com',
  'MAINSITE_HOST': 'https://www.kucoin.net',
  'MAINSITE_HOST_CN': 'https://www.kucoin.top',
  'MAINSITE_HOST_COM': 'https://www.kucoin.com',
  'KUCOIN_HOST': 'https://www.kucoin.net',
  'KUCOIN_HOST_CN': 'https://www.kucoin.top',
  'KUCOIN_HOST_COM': 'https://www.kucoin.com',
  'KUCOIN_HOST_CHINA': 'https://www.kucoin.top',
  'KUCOIN_HOST_CHINA_CN': 'https://www.kucoin.top',
  'KUCOIN_HOST_CHINA_COM': 'https://www.kucoin.top',
  'KUMEX_HOST': 'https://futures.kucoin.net',
  'KUMEX_HOST_CN': 'https://futures.kucoin.top',
  'KUMEX_HOST_COM': 'https://futures.kucoin.com',
  'KUMEX_BASIC_HOST': 'https://futures.kucoin.net/lite',
  'KUMEX_BASIC_HOST_CN': 'https://futures.kucoin.top/lite',
  'KUMEX_BASIC_HOST_COM': 'https://futures.kucoin.com/lite',
  'POOLX_HOST': 'http://pool-x.net',
  'POOLX_HOST_CN': 'http://pool-x.top',
  'POOLX_HOST_COM': 'http://pool-x.com',
  'M_POOLX_HOST': 'https://m.pool-x.net',
  'M_POOLX_HOST_CN': 'https://m.pool-x.top',
  'M_POOLX_HOST_COM': 'https://m.pool-x.com',
  'TRADE_HOST': 'https://trade.kucoin.net/trade',
  'TRADE_HOST_CN': 'https://trade.kucoin.top',
  'TRADE_HOST_COM': 'https://trade.kucoin.com',
  'TRADE_V2_HOST': 'https://trade-v2.kucoin.net',
  'TRADE_V2_HOST_CN': 'https://trade-v2.kucoin.top',
  'TRADE_V2_HOST_COM': 'https://trade-v2.kucoin.com',
  'DOCS_HOST': 'https://docs.kucoin.com',
  'DOCS_HOST_CN': 'https://docs.kucoin.com',
  'DOCS_HOST_COM': 'https://docs.kucoin.com',
  'SANDBOX_HOST': 'https://sandbox.kucoin.com',
  'SANDBOX_HOST_CN': 'https://sandbox.kucoin.com',
  'SANDBOX_HOST_COM': 'https://sandbox.kucoin.com',
  'LANDING_HOST': 'https://www.kucoin.net/land',
  'LANDING_HOST_CN': 'https://www.kucoin.top/land',
  'LANDING_HOST_COM': 'https://www.kucoin.com/land',
  'FASTCOIN_HOST': 'https://www.kucoin.net/express',
  'FASTCOIN_HOST_CN': 'https://www.kucoin.top/express',
  'FASTCOIN_HOST_COM': 'https://www.kucoin.com/express',
  'TOKEN_INFO_HOST': 'https://www.kucoin.net/token-info',
  'TOKEN_INFO_HOST_CN': 'https://www.kucoin.top/token-info',
  'TOKEN_INFO_HOST_COM': 'https://www.kucoin.com/token-info',
  'ROBOT_HOST': 'https://robot.kucoin.net',
  'ROBOT_HOST_CN': 'https://robot.kucoin.top',
  'ROBOT_HOST_COM': 'https://robot.kucoin.com',
};

export const hostConfig = {
  KUCOIN_HOST: HOST.KUCOIN_HOST, // kucoin主站地址
  TRADE_HOST: HOST.TRADE_HOST, // 交易地址
  DOCS_HOST: HOST.DOCS_HOST, // 文档地址
  KUMEX_HOST: HOST.KUMEX_HOST, // kumex地址
  SANDBOX_HOST: HOST.SANDBOX_HOST, // 沙盒地址
  MAINSITE_API_HOST: v2ApiHosts.CMS, // kucoin主站API地址
  POOLX_HOST: HOST.POOLX_HOST, // POOLX地址
  LANDING_HOST: HOST.LANDING_HOST, // 流量落地页
  TRADING_BOT_HOST: HOST.ROBOT_HOST, // 机器人
};
