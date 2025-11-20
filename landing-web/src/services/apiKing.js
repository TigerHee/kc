/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';
const prefix = '/score-center';

// if (process.env.NODE_ENV === 'development') {
//   setXversion('3126dev');
// }

// 获取交易竞赛的基础数据
export const getConfig = () => pull(`${prefix}/web/trade-compete/info`);

// 获取交易竞赛的用户信息
export const getUserInfo = () => pull(`${prefix}/web/trade-compete/user/info`);

// 用户报名
export const signUp = () => post(`${prefix}/web/trade-compete/user-sign`);

// 获取晋级的数据轮博
export const getListCarouse = () => pull(`${prefix}/web/trade-compete/user/carouse`);

// 排行榜的详情数据
export const getRankList = payload => pull(`${prefix}/web/trade-compete/rankList`, payload);

// 赛果排行奖励查询接口
export const getPrizeResult = payload =>
  pull(`${prefix}/web/trade-compete/rank/prize-result`, payload);

// 我的任务记录接口查询
export const getRecords = payload =>
  pull(`${prefix}/web/trade-compete/prize/detail`, { ...payload });

// 用户关闭晋级弹窗
export const closeUpgradeModal = () => post(`${prefix}/web/trade-compete/rise/prize-get`);
