/**
 * Owner: victor.ren@kupotech.com
 */
import { pull as get } from 'tools/request';

/**
 * 获取全站汇总数据
 *
 * @returns {Object}
 */
export async function getSummary(currency: string): Promise<any> {
  return get(`/promotion/campaign/last24HourIncome/${currency}`, {}, { cache: true });
}

/**
 * 获取全站24H交易量(包含合约)统计
 * @param {*} currency
 * @returns
 */
export async function getContractSummary(currency: string) {
  return get(`/kucoin-web-front/statistics/last24HourIncome?currency=${currency}`, {}, { cache: true });
}

// 校验人机验证结果
export async function getServerTime() {
  return get('/timestamp');
}

/**
 * 获取成交额榜
 * @returns
 */
export async function getTurnoverRank(params: { [key: string]: any; }) {
  return get(`/discover-front/spl`, params, { cache: true });
}

export function getFooterInfo() {
  return get('/resource-position/web-multilevel?positionCode=web-footer');
}
