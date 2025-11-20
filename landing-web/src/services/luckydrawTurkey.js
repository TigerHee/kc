/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';

const prefix = '/market-operation';

// 获取土耳其活动配置
export const getActivityConfig = payload => pull(`${prefix}/activity/config`, payload);

// 活动报名
export async function activityReg(params) {
  return post(`${prefix}/activity/registration`, params);
}

// 活动报名状态
export async function getRegStatus(params) {
  return pull(`${prefix}/activity/registration/status`, params);
}

// 获取默认邀请码
export async function getInvitationCode(params) {
  return pull(`/promotion/user/invitationCode`, params);
}