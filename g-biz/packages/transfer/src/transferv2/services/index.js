/**
 * Owner: solar@kupotech.com
 */
import { get, post } from '@tools/request';

/**
 * 查询账户可用币种列表 带余额
 */
export const getTransferCurrencies = (params) => {
  return post(`/account-biz-front/transfer/currencies`, params);
};

export const getTransferCurrenciesV2 = (params) => {
  return post(`/account-biz-front/v2/transfer/currencies`, params);
};

export const getCombineTransferCurrencies = (params) => {
  return post(`/account-biz-front/combine/transfer/currencies`, params);
};

// 转账查询可转金额
/**
 *
 * @param {string} accountType
 * @param {string} accountTag
 * @param {string} toAccountType
 * @param {string} toAccountTag
 * @param {string} currency
 * @param {string} subUserId
 * @param {string} direction //  "资金划转方向：OUT-母账户划转给子账户  IN-子账户划转给母账户"
 * @returns
 */
export const getTransferBalance = (params) => {
  return get(`/account-biz-front/v2/transfer/query-balance`, params);
};

/**
 * 定义主对象类型
 * @typedef {Object} payAccountInfos
 * @property {string} accountType - 划出账户类型
 * @property {string} accountTag - 划出账户tag
 */

// 组合划转可划转账户
/**
 *
 * @param {string} currency
 * @returns
 */
export const getCombineTransferBalance = (params) => {
  return post(`/account-biz-front/combine/transfer/query-balance`, params);
};

/**
 * 查询逐仓可用交易对 带余额
 */
export const getTransferIsolatedTags = (params = {}) => {
  return get(`/account-biz-front/transfer/position/tags`, params);
};

/**
 * 查询账户是否支持批量划转
 * @param {string} from
 * @param {string} to
 * @returns
 */
export const querySupportBatch = (params) => {
  return get(`/account-biz-front/transfer/batch-support`, params);
};

export const querySupportBatchV2 = (params) => {
  return post(`/account-biz-front/transfer/aggregate-check`, params);
};

// 账户间划转
export const transferApply = (params) => {
  return post(`/account-biz-front/self-transfer`, params, true);
};

// 账户顺序划转
export const multiTransferApply = (params) => {
  return post(`/account-biz-front/combine/transfer`, params);
};

/**
 * 批量划转
 */
export const transferBatchApply = (params) => {
  return post(`/account-biz-front/transfer/batch-transfer`, params);
};

/**
 * 获取当前用户杠杆交易的仓位状态与协议状态
 */
export async function queryUserMarginPosition() {
  return get('/margin-position/position/status');
}

/**
 * 查询用户指定仓位的仓位信息
 */
export async function queryIsolatedPosition(params = {}) {
  return get(`/margin-isolated-position/position/position-by-tag`, params);
}
/**
 * 获取交易所实时的币种对法币的价格
 *
 * @param base    string 法币币种 如：USD
 * @param targets string 数字货币币种，用于过滤数据， 如：BTC,KCS,ETH，参数只返回这三项的数据
 */
export function getPrices(params) {
  return get('/currency/prices', params);
}

/**
 * 获取币种可用账户（余额不准确）
 *
 * @param currency  string  当前币种
 */
export function getAvaliableByCurrency(params) {
  return get('/account-biz-front/transfer/account/currency-balances', params);
}
