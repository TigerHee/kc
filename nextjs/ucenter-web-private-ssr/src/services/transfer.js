/**
 * Owner: willen@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2019-07-19 11:32:49
 * @LastEditTime: 2020-03-24 10:18:06
 * @Description: 划转相关
 */
import { post, postJson, pull } from 'tools/request';

const prefix = '/account-biz-front';

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
  return pull(`${prefix}/v2/transfer/query-balance`, params);
};

// 账户间划转
export const transfer = (params) => {
  return post(`${prefix}/self-transfer`, params);
};

// 母子账号间划转
export const subTransfer = (params) => {
  return post(`${prefix}/sub-transfer`, params);
};

// 母子账号间划转
export const subInnerTransfer = (params) => {
  return post(`${prefix}/sub-inner-transfer`, params);
};
// kumex转出
// export const kumexTransferToMain = (params = {}) => {
//   return post(`${KUMEX_API_HOST}/kumex-account-front/account/transfer-apply`, params, false, true);
// };

/**
 * 查询账户是否支持批量划转
 * @param {string} from
 * @param {string} to
 * @returns
 */
export const batchSupport = (params) => {
  return pull(`${prefix}/transfer/batch-support`, params);
};

/**
 * 批量划转
 */
export const batchTransfer = (params) => {
  return postJson(`${prefix}/transfer/batch-transfer`, params);
};

/**
 * 批量划转 母子账户
 */
export const subBatchTransfer = (params) => {
  return postJson(`${prefix}/transfer/batch-transfer-sub`, params);
};

/**
 * 查询账户可用币种列表 带余额
 */
export const getTransferCurrencies = (params) => {
  return postJson(`${prefix}/transfer/currencies`, params);
};

/**
 * 查询逐仓可用交易对 带余额
 */
export const getTransferIsolatedTags = (params = {}) => {
  return pull(`${prefix}/transfer/position/tags`, params);
};

/**
 * 批量查询自动借出配置
 */
export async function getBatchAutoLendConf(params) {
  return pull(`${prefix}/loan/user-info/query-auto-lend-config/batch`, params);
}
