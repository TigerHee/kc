/**
 * Owner: willen@kupotech.com
 */
import { pull, post, postJson, postFetch } from 'tools/request';
import { getNamespaceUrl } from 'tools/requestHandle';

const prefix = '/promotion';
const authPrefix = '/ucenter';
const marginPrefix = '/margin-position';
const isolatedPrefix = '/margin-isolated-position';
const marginBonusPrefix = '/margin-bonus';

export function getOverview() {
  return pull(`${prefix}/campaign/yesterdayIncomeWeb`);
}
/* ********** 鼓励金 ********** */
// 鼓励金概要
export function getBonusSummary() {
  return pull(`${prefix}/encouragement/user/summary`);
}

// 获取 kcs质押 过渡期参数
export function getKcsPledgeData() {
  return pull(`${prefix}/encouragement/getStakingInterimParams`);
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
 * @description 资产概览-统计昨日所有福利汇总
 * @param currency
 * @return {*}
 */
export function getLastDayTotalInCome({ currency }) {
  return pull(`${prefix}/campaign/yesterdayTotalIncome`, { currency });
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
// 定向借贷-借贷信息-逐仓
export function getIsolatedTargetLendInfo(params) {
  return pull(`${isolatedPrefix}/target/lend/info`, params);
}
// 定向借贷-全仓仓位信息
export function getCrossPosition(params) {
  return pull(`${marginPrefix}/position/simple`, params);
}
// 定向借贷-逐仓仓位信息-
export function getIsolatedPosition(params) {
  return pull(`${isolatedPrefix}/position/current-asset`, params);
}
// 定向借贷-借入资金
export function borrowTargetLend(params) {
  return post(`${marginPrefix}/target/lend/borrow`, params, false, true);
}
// 定向借贷-借入资金-逐仓
export function borrowIsolatedTargetLend(params) {
  return post(`${isolatedPrefix}/target/lend/borrow/loan`, params, false, true);
}
// 根据用户ID获取定向借贷是否可用
export function getTargetLendStatus(params) {
  return pull('/margin-target-loan/target-lend/status/by-user', params);
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

// 获取默认邀请码
export function getInvitationCode() {
  return pull(`/promotion/user/invitationCode`);
}
// 获取默认邀请码
export function getBorrowMultiple(params) {
  return pull(`${isolatedPrefix}/borrow/multiple`, params);
}
// 1.referral bonus汇总接口
export function referralBonusOverview(params) {
  return pull(`/growth-ucenter/referral/bonus/overview`, params);
  //   return {
  //     "msg": "success",
  //     "code": "200",
  //     "success": true,
  //     "retry": false,
  //     "data": {
  //         "affiliate": false, //是否合伙人
  //         "statisticsDay": 1687190400000, //佣金统计时间
  //         "lastRebate": "10000.01212121212", //昨日应发佣金
  //         "actualRebate": "90000.01765467", //总实发佣金
  //         "referralCode": "Tjkds87", //默认邀请码
  //         "totalInvitedNum": 100012, //总邀请人数
  //         "rebateStartTime": 1687190400000, //已发佣金统计开始时间
  //         "rebateEndTime": 1687190400000 //已发佣金统计开始时间
  //     }
  // }
}

//#region 杠杆-免息券2.0

const getMarginUrl = getNamespaceUrl('margin-coupon');

/**
 * 查询用户某个优惠券使用记录
 * @param {{
 *  couponId: string,
 *  currentPage: number,
 *  pageSize: number,
 *  userId: string,
 * }} params
 */
export const getCouponDetailList = (params) => {
  const { userId, ...others } = params;
  return pull(getMarginUrl('/outer/coupon/usage-records-page'), others, {
    headers: {
      'X-USER-ID': userId,
    },
  });
};

/**
 * 用户领取或者使用优惠券
 * @param {{
 *  userId: string,
 *  activityId: string,
 *  couponId: string,
 * }} params
 */
export const couponUse = (params) => {
  const { userId, ...others } = params;
  return postFetch(getMarginUrl('/outer/coupon/use'), others, {
    options: {
      headers: {
        'X-USER-ID': userId,
      },
    },
  });
};

/**
 * 获取单个优惠券信息
 * @param {{
 *  userId: string,
 *  id: string,
 * }} params
 */
export const getCouponInfo = (params) => {
  const { userId, ...others } = params;
  return pull(getMarginUrl('/outer/coupon/one'), others, {
    headers: {
      'X-USER-ID': userId,
    },
  });
};

/**
 * 查询用户某个优惠券使用记录
 * @param {{
 *  userId: string,
 *  state?: string,
 * }} params
 */
export const getCouponList = (params) => {
  const { userId, ...others } = params;
  return pull(getMarginUrl('/outer/coupon/user-coupons'), others, {
    headers: {
      'X-USER-ID': userId,
    },
  });
};

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

//#endregion
