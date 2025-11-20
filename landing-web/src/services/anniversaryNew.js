/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';

const prefix = '/score-center';

// 任务列表
export const getTaskList = (payload) => pull(`${prefix}/annual/dinner/quest/list`, payload);

// 完成任务
export const doCompleteTask = (payload) => post(`${prefix}/annual/dinner/complete/quest`, payload);

// 用户碎片信息
export const getFragmentInfo = (payload) => pull(`${prefix}/annual/dinner/fragment/info`, payload);

// 活动配置
export const getActivityConfig = () => pull(`${prefix}/annual/dinner/activity`);

// 用户签到信息
export const getUserCheckInfo = () => pull(`${prefix}/annual/dinner/checkIn/info`);

// 用户签到
export const userCheckIn = () => post(`${prefix}/annual/dinner/checkIn`);

// 用户报名信息
export const getUserSignInfo = () => pull(`${prefix}/annual/dinner/signInfo`);

// 用户报名
export const userSignIn = params => post(`${prefix}/annual/dinner/user-sign`, params);

//兑换记录
export const getRecord = payload => pull(`${prefix}/turntable/exchange/record`, payload);

//赠送记录
export const getGiveRecord = payload => pull(`${prefix}/annual/dinner/giveFragement/list`, payload);

//认购记录
export const getDiscountRecord = () => pull(`${prefix}/annual/dinner/query/subscribe/discount`);

// 获取红包雨信息
export const getRedpacketInfo = () => pull(`${prefix}/get-welfare`);

// 兑换大金币/门票
export const exchangeBig = () => post(`${prefix}/annual/dinner/exchange/gold`);

// 查询活动场次
export const getActivityTimes = () => pull(`${prefix}/annual/dinner/activity/time/config`);

// 查询低价折扣信息
export const getDiscountInfo = () => pull(`${prefix}/annual/dinner/subscribe/discount/coupon`);

// 单个碎片抽奖配置
export const getSinglePieceConfig = () => pull(`${prefix}/turntable/activity/config`);

// 单个碎片抽奖
export const singlePieceExchange = payload => post(`${prefix}/turntable/integral/lottery`, payload);

// 查询组合兑换配置
export const getComposeConfig = () => pull(`${prefix}/annual/dinner/compose`);

// 组合兑换抽奖
export const composeExchange = (payload) => post(`${prefix}/annual/dinner/compose/exchange`, payload, false, true);

// 查询碎片抽奖轮播
export const getScrollList = () => pull(`${prefix}/turntable/carousel`);

// 查询回顾数据
export const getSummaryInfo = () => pull(`${prefix}/annual/dinner/activity/summary`);

//秒杀活动的配置
export const getSpikeConfig = () => pull(`${prefix}/spike/config`);

//秒杀活动的奖品
export const getSpikeListPrize = () => pull(`${prefix}/spike/list-prize`);

//低价认购接口
export const completeDiscount = payload => post(`${prefix}/annual/dinner/subscribe/discount`, payload, false, true);

//查询瓜分奖池信息
export const getCarveUpInfo = () => pull(`${prefix}/annual/dinner/carveUp/info`);

//瓜分奖池
export const carveUpPrize = () => post(`${prefix}/annual/dinner/carveUp`);

//碎片赠送
export const giveFragement = payload => post(`${prefix}/annual/dinner/give/fragment`, payload, false, true);

//限时秒杀
export const spikeTicket = () => post(`${prefix}/spike/lottery`);
