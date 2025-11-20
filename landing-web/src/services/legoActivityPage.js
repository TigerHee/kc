/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';

const prefix = '/platform-doraemon';
const invite_prefix = '/growth-ucenter';

// 获取默认邀请码
export function getInvitationCode(params) {
  return pull(`/promotion/user/invitationCode`, params);
}

// 获取新版邀请码
export function getNewInvitationCode(params = {}) {
  return pull(`${invite_prefix}/v2/invitation-code/default`, params);
};

/**
 * 查询交易竞赛-排行榜数据
 * @param {*} params 
 * @returns 
 */
export function getRankList(params) {
  return pull(`${prefix}/trade-rank/rank-list`, params);
}

/**
 * 活动报名
 * @param {*} params 
 * @returns 
 */
export function signUp(params) {
  return post(`${prefix}/activity/sign-up`, params);
}

/**
 * 获取活动配置-线上
 * @param {*} params 
 * @returns 
 */
export function getOnlineActivityConfig({ subject, ...rest } = {}) {
  return pull(`${prefix}/get/activity/config?subject=${subject}`, rest);
}

/**
 * 获取活动配置-预览
 * @param {*} params 
 * @returns 
 */
export function getPreviewActivityConfig(params) {
  return pull(`${prefix}/get/preview/activity/detail`, params); 
}
