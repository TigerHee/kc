/**
 * Owner: borden@kupotech.com
 */
import { pull } from 'utils/request';

const prefix = '/margin-fund';

// 查询用户同意协议,返回data为true，标志用户已同意
export const checkUserAgreement = (params) => {
  return pull(`${prefix}/agreement/chk`, params);
};
// 保存用户同意协议
export const agreeAgreement = (params) => {
  return pull(`${prefix}/agreement/agree`, params);
};
// 获取杠杆代币 info
export const queryCurrencyInfo = (params) => {
  return pull(`${prefix}/fund/currency/info`, params);
};
// 查询净值
export const queryCurrencyNav = (params) => {
  return pull(`${prefix}/fund/currency/nav`, params);
};
// 模糊查询代币币种基础信息列表
export const queryBaseTokens = (params) => {
  return pull(`${prefix}/fund/currency/base-list`, params);
};
