/**
 * Owner: borden@kupotech.com
 */
import { pull, post } from 'utils/request';

// const pull = pullWrapper(originPull);
const loanPrefix = '/margin-loan';
const borrowPrefix = '/margin-position';
const marginConfigPrefix = '/margin-config';
/**
 * 获取当前用户杠杆交易的仓位状态与协议状态
 */
export async function getUserMarginPostion() {
  return pull('/margin-position/position/status');
}

/**
 * 获取当前用户杠杆账户的明细信息
 */
export async function getUserMarginPostionDetail() {
  return pull('/margin-position/position/detail');
}

/**
 * 获取当前用户全仓借/还币种列表
 */
export async function getMarginLoanAbleDetail() {
  return pull('/margin-position/position/loanAble/detail');
}


/**
 * 用户签订杠杆交易协议
 */
export async function userSignAgreement() {
  return post('/margin-position/position', { channel: 'WEB' });
}

/**
 * 查询借入页面杠杆账户明细信息
 */
export async function getBorrowSize(params) {
  return pull(`${borrowPrefix}/borrow/size`, params);
}

/**
 * 获取当前用户杠杆交易的仓位状态与协议状态
 */
export async function getMarginCoins() {
  return pull('/margin-config/margin-currencies');
}

/**
 * 提交借入
 */
export async function postBorrow(params) {
  return post(`${borrowPrefix}/borrow/loan`, params);
}

/**
 * 可借额度查询
 */
export async function postRepay(params) {
  return post(`${borrowPrefix}/borrow/repay`, params);
}

/**
 *
 * 查询用户单个currency指定accountType、tag的账户信息
 * @param accountType
 * @param currency
 * @returns {Promise<void>}
 */
export async function getAccountCoinInfo({ accountType = 'MARGIN', currency, tag = 'DEFAULT' }) {
  return post('/account-front/query/currency-balance', {
    accountType,
    currency,
    tag,
  });
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
 * 设置自动还款配置
 */
export async function pullExpectedRate(params) {
  return pull(`${loanPrefix}/outer/loan/order/forecast/rate`, params);
}

/**
 * 获取所有杠杆配置信息
 */
export async function pullConfigs(params) {
  return pull(`${marginConfigPrefix}/configs`, params);
}

/**
 * 获取所有杠杆配置信息(需要登录)
 */
export async function pullConfigsByUser(params) {
  return pull(`${marginConfigPrefix}/configs/by-user-id`, params);
}

/**
 * 修改用户杠杆倍数
 */
export async function updateUserLeverage(params = {}) {
  return post(`${borrowPrefix}/position/update-user-leverage`, params);
}
/**
 * 查询参考日利率
 */
export async function queryReferRate(params = {}) {
  return post(`${loanPrefix}/outer/loan/order/query-refer-rate`, params);
}
/**
 * 全仓币种配置
 */
export async function getCrossCurrencies(params) {
  return pull(`${marginConfigPrefix}/new-margin-currencies`, params);
}
/**
 * 全仓币种配置(需要登录)
 */
export async function getCrossCurrenciesByUser(params) {
  return pull(`${marginConfigPrefix}/v2/new-margin-currencies`, params);
}
/**
 * 借贷币种配置
 */
export async function getLoanCurrencies(params) {
  return pull(`${marginConfigPrefix}/loan-currencies`, params);
}
