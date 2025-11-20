/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';
const prefix = '/score-center';

// 获取数据
export const getConfig = () => pull(`${prefix}/activity/guess/config`);

// 根据日期获取 日期的数据数组
export const getSchedulesByDate = (query) => pull(`${prefix}/activity/guess/guessInfos`, query);

// 根据 竞猜模块 Id 获取 竞猜模块 数据 + number 数据
export const getDataByScheduleId = (query) => pull(`${prefix}/activity/guess/guessInfo`, query);

// 提交竞猜号码
export const submitNumber = payload => post(`${prefix}/activity/guess/submit`, payload, false, true);

// 分页查询
export const getGuessRecords = (query) => pull(`${prefix}/activity/guess/guessRecord`, query);

// 用户竞猜记录分页查询
export const getGuessRecord = (query) => pull(`${prefix}/activity/guess/guessRecord/pageList`, query);

// 单场-用户竞猜记录
export const getUserGuessList = (query) => pull(`${prefix}/activity/guess/userGuessList`, query);

// 分页查询中奖用户
export const getWinnerList = (query) => pull(`${prefix}/activity/guess/winPrizeRecord`, query);

// 获取默认邀请码
export async function getInvitationCode(params) {
  return pull(`/promotion/user/invitationCode`, params);
}

// 获取用户中奖提醒数据
export async function getWinnerTip(params) {
  return pull(`${prefix}/activity/guess/userPrizePop`, params);
}

// 关闭中奖弹窗
export const closeWinnerTip = payload => post(`${prefix}/activity/guess/userPrizeHavePop?id=${payload.id}`, payload, false, true);
