/**
 * Owner: solar@kupotech.com
 */
import { get, post } from '@tools/request';

/**
 * 获取所有币种
 *
 * @returns {Object} currencyType:1法币  2所有 0数字货币
 */
export async function getCoinsCategory(status) {
  return get('/currency/site/transfer-currencies', { status, flat: 1, currencyType: 2 });
}

/**
 * 获取当前用户杠杆交易的仓位状态与协议状态
 */
export async function getUserMarginPostion() {
  return get('/margin-position/position/status');
}

/**
 * 借贷币种配置
 */
export async function getLoanCurrencies(params) {
  return get(`/margin-config/loan-currencies`, params);
}

// 判断用户是否开启了某种交易类型
export async function getAccountOpenConfig(params) {
  return get('/ucenter/is-open', params);
}

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
 * 查询账户可用币种列表 带余额
 */
export const getTransferCurrencies = (params) => {
  return post(`/account-biz-front/transfer/currencies`, params);
};

// 账户间划转
export const transfer = (params) => {
  return post(`/account-biz-front/self-transfer`, params, true);
};

/**
 * 批量划转 母子账户
 */
export const subBatchTransfer = (params) => {
  return post(`/account-biz-front/transfer/batch-transfer-sub`, params, true);
};

// 判断用户是否开启了期权账户
export async function checkOptions(params) {
  return get('/margin-option/outer/option/user/agreement/check', params);
}

/**
 * 全仓币种配置
 */
export async function getCrossCurrencies(params) {
  return get(`/margin-config/new-margin-currencies`, params);
}

/**
 * 批量划转
 */
export const batchTransfer = (params) => {
  return post(`/account-biz-front/transfer/batch-transfer`, params);
};

/**
 * 查询账户是否支持批量划转
 * @param {string} from
 * @param {string} to
 * @returns
 */
export const batchSupport = (params) => {
  return get(`/account-biz-front/transfer/batch-support`, params);
};

/**
 * 查询逐仓可用交易对 带余额
 */
export const getTransferIsolatedTags = (params = {}) => {
  return get(`/account-biz-front/transfer/position/tags`, params);
};

/**
 * 查询自动借出配置
 */
export async function getAutoLendConf(params) {
  return post(`/margin-loan/outer/loan/user-info/query-auto-lend-config`, params, true);
}

/**
 * 批量查询自动借出配置
 */
export async function getBatchAutoLendConf(params) {
  return get(`/account-biz-front/loan/user-info/query-auto-lend-config/batch`, params);
}

// 获取所有逐仓杠杆币种配置
export async function getAllSymbolConfigs(params = {}) {
  return get(`/margin-config/margin-isolated-position-cfg/symbols`, params);
}

// 查询用户指定仓位的仓位信息
export async function getIsolatedAppoint(params = {}) {
  return get(`/margin-isolated-position/position/position-by-tag`, params);
}

// 获取法币汇率
export async function getCurrencyPrices(params = {}) {
  return get('/currency/v2/prices', params);
}
