/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';

const prefix = '/margin-fund';

// 模糊查询代币币种
export const queryTokens = (params) => {
  return pull(`${prefix}/fund/currency/condition/list`, params);
};
// 模糊查询代币币种基础信息列表
export const queryBaseTokens = (params) => {
  return pull(`${prefix}/fund/currency/base-list`, params);
};
// 查询申购记录
export const querySubscriptionHistory = (params) => {
  return pull(`${prefix}/subscribe/order/list`, params);
};
// 查询赎回记录
export const queryRedeemList = (params) => {
  return pull(`${prefix}/redeem/order/list`, params);
};
// 查询用户同意协议,返回data为true，标志用户已同意
export const checkUserAgreement = (params) => {
  return pull(`${prefix}/agreement/chk`, params);
};
// 保存用户同意协议
export const agreeAgreement = (params) => {
  return pull(`${prefix}/agreement/agree`, params);
};
// 保存用户同意协议
export const queryCurrencyInfo = (params) => {
  return pull(`${prefix}/fund/currency/info`, params);
};
// 申购
export const subscribeApply = (params) => {
  return post(`${prefix}/subscribe/order/apply`, params, false, true);
};
// 赎回
export const redeemApply = (params) => {
  return post(`${prefix}/redeem/order/apply`, params, false, true);
};
// 查询指定代币和资产的调仓记录
export const queryRebalanceList = (params) => {
  return pull(`${prefix}/rebalance/record-list`, params);
};
// 查询申购预计成交时间
export const queryDealTime = (params) => {
  return pull(`${prefix}/fund/currency/calc-time`, params);
};
