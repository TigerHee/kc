/**
 * Owner: terry@kupotech.com
 */
import { pull } from 'utils/request';
const prefix = '/platform-doraemon';
const invite_prefix = '/growth-ucenter';



// 获取默认邀请码
export async function getInvitationCode(params = {}) {
  return pull(`${invite_prefix}/v2/invitation-code/default`, params);
}

// 获取用户昵称
export async function getUserName(params) {
  return pull(`${prefix}/activity/fission/query/user-displayName`, params);
}

// 被邀请人界面配置查询
export async function getActivityInfo(params) {
  return pull(`${prefix}/activity/fission/query/invitee/activity-info`, params);
}

// 中奖信息播报
export async function getPrizeList(params) {
  return pull(`${prefix}/activity/fission/query/broadcast`, params);
}