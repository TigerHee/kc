/**
 * Owner: odan.ou@kupotech.com
 */
// 集合竞价接口

import { pull } from 'utils/request';

const service = '/market-front';
const auctionService = '/trade-front';
const CurrencyService = '/currency';

/**
 * 集合竞价： 买卖盘全量
 * @param {string} symbol
 * @param {*} limit
 * @param {*} params
 */
export const pullAuctionOrders = (symbol, limit, params) => {
  return pull(`${service}/call-auction/level2`, { ...params, symbol, limit });
};

/**
 * 获取币对集合竞价的行情信息
 * @param {{
 *  symbol: string
 * }} params
 */
export const getAuctionInfo = (params) => {
  return pull(`${service}/call-auction/info`, params);
};

/**
 * 查询集合竞价配置
 * @param {{
*  symbol: string
* }} params
*/
export const getAuctionConf = (params) => {
 return pull(`${CurrencyService}/call-auction/get`, params);
};

/**
 * 查询所有允许集合竞价白名单的交易对及其状态
*/
export const getAuctionWhiteAllowList = () => {
 return pull(`${auctionService}/callAuction/all/allowlist`);
};

/**
 * 根据symbolCode查询集合竞价白名单状态
*/
export const getAuctionWhiteStatus = (symbolCode) => {
 return pull(`${auctionService}/callAuction/${symbolCode}/allowlist/status`);
};
