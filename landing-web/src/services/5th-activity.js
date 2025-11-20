/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';
const prefix = '/platform-activity/five-years-activity';

/**
 * 报名
 */
export const postActivitySignUp = params =>
  post(`/platform-activity/activity/signUp?subject=${params?.subject}`, params, false, true);

/**
 * 提交 kcc 地址
 */
export const postKccWalletAddress = params =>
  post(`${prefix}/gem/update/kc-wallet-address`, params, false, true);

/**
 * 5 周年活动配置查询接口
 */
export const getActivityConfig = params => pull(`${prefix}/gem/query/config`, params);

/**
 * 5 周年活动查询可用宝石、卷、各种库存
 * https://wiki.kupotech.com/pages/viewpage.action?pageId=68413187
 */
export const getUserCouponDetailInfo = params =>
  pull(`${prefix}/gem/query/user/coupon-detail-info`, params);

/**
 * 5 宝石兑换-宝石库存查询
 */
export const getExchangeStockInfo = params =>
  pull(`${prefix}/gem/query/exchange/stock-info`, params, false, true);
/**
 * 低价认购宝石
 */
export const subscribleGems = params => post(`${prefix}/gem/subscrible`, params, false, true);

/**
 * 赠送宝石
 */
export const presentGems = params => post(`${prefix}/gem/present`, params, false, true);

/**
 * 开启宝箱
 */
export const unboxGems = params => post(`${prefix}/gem/unbox`, params, false, true);

/**
 * 兑换宝石
 */
export const exchangeGems = params => post(`${prefix}/gem/exchange`, params, false, true);
//抽奖
export const draw = params => post(`${prefix}/gem/lottery/draw`, params, false, true);

/**
 * 抽奖记录
 */
export const lotteryDrawRecrod = params =>
  post(`${prefix}/gem/query/prize-operate-list/lottery-draw`, params, false, true);

/**
 * 开宝箱记录
 */
export const unboxRecrod = params =>
  post(`${prefix}/gem/query/prize-operate-list/unbox`, params, false, true);

/**
 * 低价认购记录
 */
export const subscribeRecrod = params =>
  post(`${prefix}/gem/query/prize-operate-list/subscribe`, params, false, true);

/**
 * 宝石记录
 */
export const gemRecrod = params =>
  post(`${prefix}/gem/query/prize-operate-list/gem`, params, false, true);

/**
 * 获取 kcc 地址
 */
export const getKccWalletAddress = params =>
  pull(`${prefix}/gem/get/kc-wallet-address`, params, false, true);

// ====================== 助力KCS ======================

/**
 * 助力KCS-报名
 */
export const signUpKCS = params => {
  return post('/platform-activity/activity/signUp', params);
};

/**
 * 助力KCS-配置
 */
export const getKCSConfig = () => {
  return pull(`${prefix}/assistance/config`);
};

/**
 * 助力KCS-首页基本信息接口
 */
export const getKCSBaseInfo = params => {
  return pull(`${prefix}/assistance/info`, params);
};
/**
 * 助力KCS-任务清单接口
 */
export const getTaskList = params => {
  return pull(`${prefix}/assistance/task/list`, params);
};

/**
 * 助力KCS-任务记录
 */
export const getTaskRecords = params => {
  return pull(`${prefix}/assistance/records`, params);
};

/**
 * 助力KCS-完成任务
 */
export const doTask = params => {
  return post(`${prefix}/assistance/complete`, params, false, true);
};

/**
 * 获取活动3，交易量排名列表
 * @param {*} params
 * @returns
 */
export const getTradeRank = params => {
  return pull(`${prefix}/gem/query/user/trade-rank`, params);
};

// 获取默认邀请码
export async function getInvitationCode(params) {
  return pull(`/promotion/user/invitationCode`, params);
}
