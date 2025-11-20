/**
 * Owner: gavin.liu1@kupotech.com
 */

import { post, pull } from 'utils/request';

const growthCenter = `/growth-ucenter`;
const campaignCenter = `/campaign-center`;
// const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

// 进入活动页上报(复用接口): 进入活动页调用
export const reportEntry = async (params) => {
  return post(`${growthCenter}/user/behavior/report`, params, false, true);
  // return {
  //   msg: 'success',
  //   code: '200',
  //   data: true,
  //   success: true,
  //   retry: false,
  // };
};

// 判断汇总: 邀请人/被邀请人
export const getReferInfo = (params) => {
  return pull(`${campaignCenter}/invitation-support/judgment/summary`, params);
  // return {
  //   success: true,
  //   code: '200',
  //   msg: 'success',
  //   retry: false,
  //   data: {
  //     supportRule: '',
  //     firstTradeTime: 1684327102271,
  //     campaignEndTime: 168814079999999,
  //     login: true,
  //     firstEnter: false,
  //     firstTradeCompleted: true,
  //     newUserSupported: true,
  //     bonusGiftToBeObtain: true,
  //     totalSupportAmount: null,
  //     platformAmount: '40',
  //   },
  // };
};

// 5.2.2 获取用户默认邀请码(不区分用户类型，复用接口)
export const invitationCode = (params) => {
  return pull(`${growthCenter}/v2/invitation-code/default`, params);
  // return {
  //   msg: 'success',
  //   code: '200',
  //   data: '26YBPZVS',
  //   success: true,
  //   retry: false,
  // };
};

// 5.2.3 根据rcode获取邀请人信息
export const userByRcode = (params) => {
  return pull(`${growthCenter}/invitation/user-by-rcode`, params);
  // return {
  //   msg: 'success',
  //   code: '200',
  //   data: {
  //     inviterCategory: 'TocReferral', //邀请人渠道：TobReferral、TocReferral
  //     inviterUid: 111111, //邀请人uid
  //     inviterUser: 'king**@gmail.com', //邀请人名称
  //   },
  //   success: true,
  //   retry: false,
  // };
};

// 平台助力
// 1.新用户首次进入邀请助力页面时进行平台助力
// 2.邀请人助力金额满50U，进阶到10000U时再次进行平台助力
export const getPlatformAssist = (params) => {
  return post(`${campaignCenter}/invitation-support/platform-init`, params, false, true);
  // return {
  //   msg: 'success',
  //   code: '200',
  //   data: '41', //平台助力金额
  //   success: true,
  //   retry: false,
  // };
};

// 5.2.8 好友助力
export const userAssist = async (params) => {
  return post(`${campaignCenter}/invitation-support/user-assist`, params, false, true);
  // await sleep(500);

  // return {
  //   msg: 'success',
  //   code: '500030',
  //   data: true,
  //   success: true,
  //   retry: false,
  // };
};

// 助力记录

// let mockCount = 0;
export const getAssistRecords = async (params) => {
  return pull(`${campaignCenter}/invitation-support/records`, params);
  // console.log('mockCount: ', mockCount);
  // await sleep(1500);
  // mockCount++;
  // return {
  //   msg: 'success',
  //   code: '200',
  //   totalNum: 1000,
  //   success: true,
  //   totalPage: 50,
  //   pageSize: 1,
  //   currentPage: 1,
  //   items: mockCount === 3 ? [
  //     {
  //       supportUid: 111112, //助力好友uid
  //       supportUser: 'end@email.com', //助力好友名称
  //       supportAmount: '1.0', //助力金额(U)
  //       supportBehavior: 'FIRST_TRADE', //助力行为
  //       supportAt: 1684330120117, //助力时间
  //     }
  //   ] : [
  //     ...Array(20).fill(1).map((_, idx) => ({
  //       supportUid: idx, //助力好友uid
  //       supportUser: 'king**@gmail.com', //助力好友名称
  //       supportAmount: '2.2133', //助力金额(U)
  //       supportBehavior: 'FIRST_TRADE', //助力行为
  //       supportAt: 1684330120117, //助力时间
  //     }))
  //   ],
  //   retry: false,
  // };
};

// 获奖记录
export const getAwardRecords = (params) => {
  return pull(`${campaignCenter}/invitation-support/award-records`, params);
  // return {
  //   msg: 'success',
  //   code: '200',
  //   totalNum: 38,
  //   success: true,
  //   totalPage: 4,
  //   pageSize: 10,
  //   currentPage: 1,
  //   items: [
  //     {
  //       awardId: 'ReferralBonusGift1', //奖品ID
  //       logo: 'http://sasasa', //奖品logo链接
  //       valueOfUsdt: '2.2133', //价值金额(U)
  //       type: 1, //类型（1.token代币,2.优惠券,3.体验金,4.vip体验券)
  //       couponType: 1, //优惠券类型 0.杠杆券,1.合约券,2.机器人券
  //       obtainTime: 1684330120117, //领取时间
  //     },
  //     {
  //       awardId: 'ReferralBonusGift2', //奖品ID
  //       logo: 'http://sasasa', //奖品logo链接
  //       valueOfUsdt: '2.2133', //价值金额(U)
  //       type: 2, //类型（1.token代币,2.优惠券,3.体验金,4.vip体验券)
  //       couponType: 1, //优惠券类型 0.杠杆券,1.合约券,2.机器人券
  //       obtainTime: 1684330120117, //领取时间
  //     },
  //     {
  //       awardId: 'ReferralBonusGift3', //奖品ID
  //       logo: 'http://sasasa', //奖品logo链接
  //       valueOfUsdt: '2.2133', //价值金额(U)
  //       type: 3, //类型（1.token代币,2.优惠券,3.体验金,4.vip体验券)
  //       couponType: 1, //优惠券类型 0.杠杆券,1.合约券,2.机器人券
  //       obtainTime: 1684330120117, //领取时间
  //     },
  //     {
  //       awardId: 'ReferralBonusGift4', //奖品ID
  //       logo: 'http://sasasa', //奖品logo链接
  //       valueOfUsdt: '2.2133', //价值金额(U)
  //       type: 4, //类型（1.token代币,2.优惠券,3.体验金,4.vip体验券)
  //       couponType: 1, //优惠券类型 0.杠杆券,1.合约券,2.机器人券
  //       obtainTime: 1684330120117, //领取时间
  //     },
  //     {
  //       awardId: 'VIPLv1Trial', //奖品ID
  //       logo: 'http://sasasa', //奖品logo链接
  //       valueOfUsdt: '2.2133', //价值金额(U)
  //       type: 4, //类型（1.token代币,2.优惠券,3.体验金,4.vip体验券)
  //       couponType: 1, //优惠券类型 0.杠杆券,1.合约券,2.机器人券
  //       obtainTime: 1684330120117, //领取时间
  //     },
  //   ],
  //   retry: false,
  // };
};

// 好友助力
export const supportFriend = (params) => {
  return post(`${campaignCenter}/invitation-support`, params, false, true);
  // return {
  //   msg: 'success',
  //   code: '200',
  //   data: true,
  //   success: true,
  //   retry: false,
  // };
};

// 领取礼包
export const getGift = (params) => {
  return post(`${campaignCenter}/invitation-support/bonus/obtain`, params, false, true);
  // return {
  //   success: true,
  //   code: '200',
  //   msg: 'success',
  //   retry: false,
  //   data: {
  //     awardId: 'ReferralBonusGift4', //奖品ID
  //     logo: 'http://sasasa', //奖品logo链接
  //     value_of_usdt: '2.2133', //价值金额(U)
  //     type: 1, //类型（1.token代币,2.优惠券,3.体验金,4.vip体验券)
  //     coupon_type: 1, //优惠券类型 0.杠杆券,1.合约券,2.机器人券
  //   },
  // };
};
