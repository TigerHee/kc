/**
 * Owner: willen@kupotech.com
 */
import { pull, del, post } from 'tools/request';

const prefix = '/currency-front';

/**
 * 推荐活动
 */
export async function getRecommendActive() {
  return pull(`${prefix}/banner/query`);
}

/**
 * 最近活动
 */
export async function getRecentActive(type) {
  return pull(`${prefix}/recently/activities?type=${type}`);
}

/**
 * 新币列表
 */
export async function getCurrencyList(params) {
  return pull(`${prefix}/currency/new`, params);
}

/**
 * 最近新币列表
 */
export async function getLatestCurrencyList() {
  return pull(`${prefix}/currency/latest`);
}

/**
 * 最近免费币种列表
 */
export async function getFreeCurrencyList() {
  return pull(`${prefix}/currency/free`);
}

// 预约提醒
export async function currencyNotice(data) {
  return post(`${prefix}/new/currency/notice?currency=${data.currency}`);
}

// 预约新币
export async function currencyBook(data) {
  return post(`${prefix}/new/currency/book`, data, false, true);
}

// 撤销预约
export async function currencyBookCancle(data) {
  return del(`${prefix}/new/currency/book`, data);
}

// 预约记录列表
export async function queryBookList(data) {
  return post(`${prefix}/new/currency/book/page`, data, false, true);
}
/**
 * 获取一些配置
 */
export async function getBaseConfig() {
  return pull(`${prefix}/currency/list/config`);
}

/**
 * 获取某个币种的信息
 *
 * @param symbol 币种
 */
export async function pullCoinInfo({ symbol }) {
  return pull('/pool-info/currency/info', { symbol });
}
