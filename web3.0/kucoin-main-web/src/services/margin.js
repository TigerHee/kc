/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';
// import Mock from 'mockjs'
const loanPrefix = '/margin-loan';
const borrowPrefix = '/margin-position'; // 全仓
const borrowIsolatedPrefix = '/margin-isolated-position'; // 逐仓
const configPrefix = '/margin-config';
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
 * 查询借出委托单
 */
export async function getLoanEntrustList(params) {
  return post(`${loanPrefix}/outer/loan/order/query-lend-order`, params);
}

/**
 * 查询借出交易单
 */
export async function getLoanTradeList(params) {
  return post(`${loanPrefix}/outer/loan/order/query-lend-trade-order`, params);
}

/**
 * 撤销借出委托单
 */
export async function cancelLoanOrder(params) {
  return post(`${loanPrefix}/outer/loan/order/cancel`, params);
}

/**
 * 查询借出市场
 */
export async function getLoanMarkets(params) {
  return post(`${loanPrefix}/outer/loan/order/query-funding-book`, params);
}

/**
 * 查询用户借贷资产
 */
export async function getLoanAsserts(params) {
  return post(`${loanPrefix}/outer/loan/user-info/query-loan-asserts`, params);
}

/**
 * 关闭用户所有自动借出
 */
export async function closeAllAutoLend(params) {
  return post(`${loanPrefix}/outer/loan/user-info/close-all-auto-lend`, params);
}

/**
 * 获取自动还款配置
 */
export async function getAutoRepayConfig() {
  return pull(`${borrowPrefix}/user/autoRepaySwitch`);
}

/**
 * 设置自动还款配置
 */
export async function setAutoRepayConfig(params = {}) {
  return post(`${borrowPrefix}/user/autoRepaySwitch`, params);
}

/**
 * 查询借入页面全仓杠杆账户明细信息
 */
export async function getBorrowSize(params) {
  return pull(`${borrowPrefix}/borrow/size`, params);
}

/**
 * 查询借入页面逐仓杠杆账户明细信息
 */
export async function getBorrowIsolatedAppoint(params) {
  return pull(`${borrowIsolatedPrefix}/position/position-by-tag-direct`, params);
}

/**
 * 借入前计算杠杆倍数
 */
export async function getBorrowMultiple(params) {
  return pull(`${borrowPrefix}/borrow/multiple`, params);
}

/**
 * 查询借入待还款列表 (全仓)
 */
export async function getPendingList(params) {
  return pull(`${borrowPrefix}/borrow/loan/repaying`, params);
}

/**
 * 查询借入待还款列表 (逐仓)
 */
export async function getIsolatedPendingList(params) {
  return pull(`${borrowIsolatedPrefix}/borrow/trade/repaying`, params);
}

/**
 * 查询借入已还款列表 (全仓)
 */
export async function getDoneList(params) {
  return pull(`${borrowPrefix}/borrow/loan/payedoff`, params);
}

/**
 * 查询借入已还款列表 (逐仓)
 */
export async function getIsolatedDoneList(params) {
  return pull(`${borrowIsolatedPrefix}/borrow/trade/paid-up`, params);
}

/**
 * 获取当前用户杠杆交易的仓位状态与协议状态
 */
export async function getMarginCoins(params = {}) {
  return pull('/margin-config/margin-currencies', params);
}

/**
 * 提交借入 (全仓)
 */
export async function postBorrow(params) {
  return post(`${borrowPrefix}/borrow/loan`, params);
}

/**
 * 提交借入 （逐仓）
 */
export async function postIsolatedBorrow(params) {
  return post(`${borrowIsolatedPrefix}/borrow/loan`, params);
}

/**
 * 提交借出
 */
export async function postLend(params) {
  return post(`${loanPrefix}/outer/loan/order/lend`, params);
}
/**
 * 提交自动借出
 */
export async function postAutoLend(params) {
  return post(`${loanPrefix}/outer/loan/user-info/config-auto-lend`, params);
}
/**
 * 查询自动借出配置
 */
export async function getAutoLendConf(params) {
  return post(`${loanPrefix}/outer/loan/user-info/query-auto-lend-config`, params);
}
/**
 * 可借额度查询
 */
export async function getAvalibleLendAmount(params) {
  return post(`${loanPrefix}/outer/loan/order/query-remain-lend-amount`, params);
}

/**
 * 全仓还币-空投币种使用
 */
export async function postRepayForAirDrop(params) {
  return post('/margin-loan-airdrop/outer/user-repay', params, false, true);
}
/**
 * 全仓可借额度查询
 */
export async function postRepay(params) {
  return post(`${borrowPrefix}/borrow/repay`, params);
}

/**
 * 逐仓可借额度查询
 */
export async function postIsolatedRepay(params) {
  return post(`${borrowIsolatedPrefix}/borrow/repay`, params);
}

/**
 * 用户总权益查询
 */
export async function getUserOwnedAsset(params) {
  return pull('/kucoin-web-front/asset/main-account-currency-asset', params);
}
/**
 * 查询市场平均利率
 */
export async function getAverageRatio(params) {
  return post(`${loanPrefix}/outer/loan/order/query-avg-rate`, params);
}
/**
 * 查询市场平最小利率
 */
export async function getMinRatio(params) {
  return post(`${loanPrefix}/loan/order/query-min-int-rate`, params);
}
/**
 * 一键撤销
 */
export async function batchCancel(params) {
  return post(`${loanPrefix}/outer/loan/order/batch-cancel`, params);
}
/**
 * 全仓币种配置
 */
export async function getCrossCurrencies(params) {
  return pull(`${configPrefix}/new-margin-currencies`, params);
}
/**
 * 借贷币种配置
 */
export async function getLoanCurrencies(params) {
  return pull(`${configPrefix}/loan-currencies`, params);
}
/**
 * kcs七日最优利率
 */
export async function getKcsProfitRate(params) {
  return pull(`${configPrefix}/kcs-profit-rate`, params);
}
/**
 * 查询参考日利率
 */
export async function queryReferRate(params = {}) {
  return post(`${loanPrefix}/outer/loan/order/query-refer-rate`, params);
}
/**
 * 获取当前用户全仓借/还币种列表
 */
export async function getMarginLoanAbleDetail() {
  return pull('/margin-position/position/loanAble/detail');
}
/**
 * 修改用户杠杆倍数
 */
export async function updateUserLeverage(params = {}) {
  return post(`${borrowPrefix}/position/update-user-leverage`, params);
}
