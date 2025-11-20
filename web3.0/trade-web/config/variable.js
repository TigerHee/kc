/**
 * Owner: garuda@kupotech.com
 * 变量
 */

// 产物一致性没有这个site-config.json
const { site, XVersion } = {
  site: 'dev',
};

const base = require('./base');

const apiHost = '/_api';
// const apiHost = base.isProd ? '/_api' : 'https://v2.kucoin.net/_api';
// 机器人接口
const apiRobotHost = '/_api_robot';
// 合约接口
const apiFuturesHost = '/_api_kumex';

const siteCfg = {
  /** CMS接口地址 */
  'API_HOST.CMS': apiHost,
  /** WEB接口地址 */
  'API_HOST.WEB': apiHost,
  /** ROBOT接口地址 */
  'API_HOST.ROBOT': apiRobotHost,
  /** Futures接口地址 */
  'API_HOST.FUTURES': apiFuturesHost,
};

module.exports = {
  ...base,
  siteCfg,
  site,
  XVersion,
};
