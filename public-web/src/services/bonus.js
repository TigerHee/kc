/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';

const prefix = '/promotion';
const authPrefix = '/ucenter';
const marginPrefix = '/margin-position';
const marginBonusPrefix = '/margin-bonus';

export function getOverview() {
  return pull(`${prefix}/campaign/yesterdayIncomeWeb`);
}
/* ********** 鼓励金 ********** */
// 鼓励金概要
export function getBonusSummary() {
  return pull(`${prefix}/encouragement/user/summary`);
}

// 待提取鼓励金条数
export function getPendingBonusCount() {
  return pull(`${prefix}/encouragement/undraw-count`);
}

// 鼓励金分页列表
export function getBonusRecords() {
  return pull(`${prefix}/encouragement/user/details`);
}

// 提取所有鼓励金
export function receiveAllBonus() {
  return pull(`${prefix}/encouragement/draw/all`);
}

/* ********** 邀请奖 ********** */
// 邀请人数关系
export function getReferralUserCount() {
  return pull(`${authPrefix}/user/referrer-count`);
}

// 邀请奖励记录
export function getReferralRecords(params) {
  return pull(`${prefix}/invitation/getAllAward`, params);
}

// 邀请奖TOTAL
export function getReferralTotal(params) {
  return post(`${prefix}/invitation/getTotalAmount`, params);
}

// 昨日邀请奖
export function getYesterdayReferral() {
  return pull(`${prefix}/invitation/yesterdayIncome`);
}

// 邀请奖待领取条数
export function getPendingReferralCount() {
  return pull(`${prefix}/invitation/getWaitReceiveNumber`);
}

// 提取邀请奖励
export function receiveAllReferral() {
  return post(`${prefix}/invitation/receiveAll`);
}

/**
 * @description 用户提取鼓励金
 * @return {Promise<*>}
 */
export async function getEncouragement() {
  return post(`${prefix}/encouragement/draw/all`);
}

/**
 * @description 获取用户鼓励金概要
 * @return {Promise<*>}
 */
export async function getSummary() {
  return pull(`${prefix}/encouragement/user/summary`);
}

/**
 * @description 分页获取用户鼓励金列表
 * @param page
 * @param pageSize
 * @return {Promise<*>}
 */
export async function getEncouragementList({ page, pageSize }) {
  return pull(`${prefix}/encouragement/user/details`, { page, pageSize });
}

/* *********其他获赠*********** */
export function getRewardsRecords(params) {
  return pull(`${prefix}/campaign/getOtherAwardList`, params);
}


// 获取昨日福利相关信息
export function getUserYesterdayIncome(params) {
  return pull(`${prefix}/campaign/userYesterdayIncome`, params);
}
// 根据用户获取活动
export function getTargetLends(params) {
  return pull('/margin-target-loan/target-lend/by-user', params);
}
// 定向借贷-借贷信息
export function getTargetLendInfo(params) {
  return pull(`${marginPrefix}/target/lend/info`, params);
}
// 定向借贷-借入资金
export function borrowTargetLend(params) {
  return post(`${marginPrefix}/target/lend/borrow`, params, false, true);
}
// 根据用户ID获取定向借贷是否可用
export function getTargetLendStatus(params) {
  return pull('/margin-target-loan/target-lend/status/by-user', params);
}
// 参与活动的埋点统计
export function submitTargetLendParticipation(params) {
  return post('/margin-target-loan/target-lend/participation', params);
}
// 根据用户ID获取杠杆赠金是否可用
export function getMarginBonusStatus(params) {
  return pull(`${marginBonusPrefix}/bonus/status/by-user`, params);
}
// 分页查询用户赠金记录(非init状态)
export function getMarginBonusList(params) {
  return post(`${marginBonusPrefix}/bonus/list/by-user`, params, false, true);
}
// 领取赠金
export function receiveMarginBonus(params) {
  return post(`${marginBonusPrefix}/bonus/receive`, params, false, true);
}
