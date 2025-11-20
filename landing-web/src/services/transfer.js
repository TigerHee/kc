/**
 * Owner: jesse.shao@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2019-07-19 11:32:49
 * @LastEditTime: 2024-08-20 15:03:41
 * @Description: 划转相关
 */
// import { KUMEX_API_HOST } from 'utils/siteConfig';
import request, { pull, post } from 'utils/request';

const prefix = '/account-biz-front';
const loanPrefix = '/margin-loan';

// 判断用户是否开启了某种交易类型
export async function getAccountOpenConfig(params) {
  return pull('/ucenter/is-open', params);
}
/**
 * 查询自动借出配置
 */
 export async function getAutoLendConf(params) {
  return post(`${loanPrefix}/outer/loan/user-info/query-auto-lend-config`, params);
}
/**
 * 提交自动借出
 */
 export async function postAutoLend(params) {
  return post(`${loanPrefix}/outer/loan/user-info/config-auto-lend`, params);
}
/**
 * 获取当前用户杠杆交易的仓位状态与协议状态
 */
 export async function getUserMarginPostion() {
  return pull('/margin-position/position/status');
}

/**
 * 用户签订杠杆交易协议
 */
 export async function userSignAgreement() {
  return post('/margin-position/position', { channel: 'WEB' });
  // return post('http://192.168.17.19:2084/position', { channel: 'WEB' });
}

/**
 * 获取当前用户杠杆交易的仓位状态与协议状态
 */
 export async function getMarginCoins(params = {}) {
  return pull('/margin-config/margin-currencies', params);
}

// 转账查询可转金额
export const getTransferBalance = (params) => {
  return pull(`${prefix}/transfer/query-balance`, params);
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
