/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';
const prefix = '/score-center';


/**
 * 提交答案
 * @param {*} params 
 * @returns 
 */
export const commitAnswer = (params) => {
  return post(`${prefix}/activity/answer/commit`, params, false, true);
};

/**
 * 
  学习任务提交并抽奖
 * @param {*} params 
 */
export const learnBounsApply = (params) => {
  return post(`${prefix}/activity/answer/learnQuest/complete`, params, false, true);
}

/**
 * 获取活动当日-答题列表
 * @param {*} params 
 */
export const getAnswerList = (params) => {
  return pull(`${prefix}/activity/answer/list`, params);
};

/**
 * 查询用户当天答题情况
 * @param {*} params 
 * @returns 
 */
export const getTodayAnswerInfo = (params) => {
  return pull(`${prefix}/activity/answer/userAnswerInfo`, params);
}

/**
 * 查询答题历史
 * @param {*} params 
 * @returns 
 */
export const userActivityRecords = (params) => {
  return pull(`${prefix}/activity/answer/userRecords`, params);
}

/**
 * 查询答题活动配置
 * @param {*} params 
 * @returns 
 */
export const getQuizConfig = (params) => {
  return pull(`${prefix}/activity/common/config`, params);
}

/**
 * 用户是否活动报名
 * @param {*} params 
 * @returns 
 */
export const isActivityRegister = (params) => {
  return pull(`${prefix}/activity/isSignUp`, params);
}

/**
 * 用户-活动报名
 * @param {*} params 
 * @returns 
 */
 export const activityApply = (params) => {
  return post(`${prefix}/activity/userSignUp`, params, false, true);
}



// 获取默认邀请码
export async function getInvitationCode(params) {
  return pull(`/promotion/user/invitationCode`, params);
}