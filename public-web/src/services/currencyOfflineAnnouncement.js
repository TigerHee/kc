/**
 * Owner: solarxia@kupotech.com
 */
import { pull } from 'tools/request';

const nameSpace = '/trade-front';

/**
 * @typedef {Object} FilterOption
 * @property {string} currencyName - 币种名称
 * @property {number} currentPage - 当前页
 * @property {number} pageSize - 每页数量
 */
/**
 * 查询币种下线公告
 * @param {FilterOption} filterOption
 * @returns
 */
export async function getOfflineNotices(data) {
  return pull(`${nameSpace}/currency/offline/notices`, data);
}
