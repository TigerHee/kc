/**
 * Owner: borden@kupotech.com
 */

import { pull, post, postJson } from 'utils/request';

const prefix = '/promotion';
const authPrefix = '/ucenter';


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

/**
 * margin-coupon
 * 免息券
 * 查询用户24小时内未领取的最新优惠券
 */
export const getLastCoupon = () => {
  return pull('/margin-coupon/outer/coupon/last-coupon');
};

/**
 * @description 资产概览-统计昨日所有福利汇总
 * @param currency
 * @return {*}
 */
export function getLastDayTotalInCome({ currency }) {
  return pull(`${prefix}/campaign/yesterdayTotalIncome`, { currency });
}
// 根据用户ID获取定向借贷是否可用
export function getTargetLendStatus(params) {
  return pull('/margin-target-loan/target-lend/status/by-user', params);
}
// 根据用户ID获取杠杆赠金是否可用
export function getMarginBonusStatus(params) {
  return pull('/margin-bonus/bonus/status/by-user', params);
}
// 用户可用的优惠券
export function getUsableCoupons(params) {
  return pull('/margin-coupon/outer/coupon/usable', params);
}
// 用户优惠券概览
export function getCouponsView(params) {
  return pull('/margin-coupon/outer/coupon/view', params);
}
// 用户优惠券概览
export function toUseCoupon(params) {
  return postJson('/margin-coupon/outer/coupon/use', params);
}
