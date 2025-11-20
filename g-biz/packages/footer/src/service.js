/**
 * Owner: iron@kupotech.com
 */
import { get } from '@tools/request';
import { BASE_CURRENCY } from './common/constants';
/**
 * 获取全站汇总数据
 *
 * @returns {Object}
 */
export function getSummary(currency) {
  return get(`/promotion/campaign/last24HourIncome/${currency}`);
}

/**
 * 获取全站24H交易量(包含合约)统计
 * @param {*} currency
 * @returns
 */
export function getContractSummary(currency = BASE_CURRENCY) {
  return get(`/kucoin-web-front/statistics/last24HourIncome?currency=${currency}`);
}

// 校验人机验证结果
export function getServerTime() {
  return get('/timestamp');
}

/**
 * 获取成交额榜
 * @returns
 */
export function getTurnoverRank(params) {
  return get(`/discover-front/spl`, params);
}

export function getFooterInfo() {
  return get('/resource-position/web-multilevel?positionCode=web-footer');
}
