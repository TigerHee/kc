/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';

const prefix = '/campaign-center';

// lego 预览页详情
export function getPreviewConfig(params) {
  return pull(`${prefix}/lego/config/detail`, params);
}

// lego 已上线页详情
export function getConfig(params) {
  return pull(`${prefix}/lego/config/detail/online`, params);
}

// 获取默认邀请码
export function getInvitationCode(params) {
  return pull(`/promotion/user/invitationCode`, params);
}

// 活动报名
export async function activityReg(params) {
  return post(`${prefix}/activity/registration`, params);
}

// 活动报名状态
export async function getRegStatus(params) {
  return pull(`${prefix}/activity/registration/status`, params);
}