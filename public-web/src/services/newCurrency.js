/**
 * Owner: willen@kupotech.com
 */
import { del, post, pull } from 'tools/request';

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
export async function getLatestCurrencyList(params) {
  return pull(`${prefix}/currency/latest`, params);
}

/**
 * 最近新币列表 v2
 */
export async function getLatestCurrencyListV2() {
  return pull(`${prefix}/v2/currency/latest`);
}

/**
 * 最近免费币种列表
 */
export async function getFreeCurrencyList() {
  return pull(`${prefix}/currency/free`);
}

/**
 *  新币榜，涨幅榜新接口，来源于机会发现
 *  接口文档：
 *  http://10.232.70.99:10240/swagger-ui/#/%E5%8F%91%E7%8E%B0%E4%B8%93%E5%8C%BA%20-%20SPL%E6%8E%A5%E5%8F%A3/getSplUsingGET
 */
export async function getCoinList(params) {
  return pull(`/discover-front/spl`, params);
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

// 预约记录数量
export async function queryBookSummary(data) {
  return pull(`${prefix}/currency/book/summary`, data);
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

/**
 * 批量获取k线数据
 */
export const getBatchedKLineData = (params) => {
  return pull('/order-book/candles/batch', params);
};
