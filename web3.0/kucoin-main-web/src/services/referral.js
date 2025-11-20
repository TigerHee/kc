/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';

const prefix = '/promotion';
const affiliatePrefix = '/growth-affiliate';

// 上周返佣信息
export async function lastWeekRebate() {
  return pull(`${prefix}/invitation-rebate/lastWeekRebate-data`);
}

// 总计返佣信息
export async function totalRebate() {
  return pull(`${prefix}/invitation-rebate/totalRebate-data`);
}

// 直接邀请列表
export async function directInviteList(data) {
  return pull(`${prefix}/invitation-rebate/directRebate-list`, data);
}

// 二级合伙人邀请列表
export async function secondInviteList(data) {
  return pull(`${prefix}/invitation-rebate/secondRebate-list`, data);
}

// 邀请码列表
export async function inviteCodeList(data) {
  return pull(`${prefix}/invitation/invitationCode-list`, data);
}

// 创建邀请码
export async function inviteCode(data) {
  return post(`${prefix}/invitation/invitationCode-add`, data, false, true);
}

// 邀请码设为默认
export async function setDefaultCode(data) {
  return post(`${prefix}/invitation/invitationCode-setDefault`, data, false, true);
}

// 修改邀请码备注
export async function editRemark(data) {
  return post(`${prefix}/invitation/remark-update`, data, false, true);
}

// 默认邀请码
export async function defaultCode() {
  return pull(`${prefix}/invitation/invitationCode-default`);
}

// 可创建邀请码数量
export async function createableCodeNum() {
  return pull(`${prefix}/invitation/invitationCode-number`);
}

// 合伙人默认信息
export async function partnerInfo() {
  return pull(`${prefix}/invitation/affiliateInfo`);
  // return {
  //   success: true,
  //   code: '200',
  //   msg: 'success',
  //   retry: false,
  //   data: {
  //     id: '631ff4a07dd51700015098b0',
  //     email: null,
  //     phone: null,
  //     level: 3,
  //     directRebateRatio: 0,
  //     secondRebateRatio: 5,
  //     rebatePeriod: 365,
  //     invitationCode: 'Oqrkodu',
  //     whitelist: true,
  //     upgradeDuration: 30,
  //   },
  // };
}

// 是否是合伙人
export async function isPartner() {
  return pull(`${prefix}/invitation/affiliate-status`);
}

// 合伙人申请记录查询
export async function affiliateApplyRecord() {
  return pull(`${prefix}/affiliate/apply/record`);
}

// 提交合伙人申请
export async function affiliateApply(data) {
  return post(`${prefix}/affiliate/apply`, data, false, true);
}

// 合伙人成果数据
export async function partnerSummary() {
  return pull(`${prefix}/affiliate/summary`);
}

// 合伙人每日统计数据
export async function dailyStat() {
  return pull(`${affiliatePrefix}/v2/affiliate/rebate/daily-stat`);

  // return {
  //   success: true,
  //   code: '200',
  //   msg: 'success',
  //   retry: false,
  //   data: {
  //     statDate: 1681315200000, //-- 数据刷新时间/统计时间
  //     startDate: 1681315200000, //-- 统计开始时间
  //     endDate: 1681315200000, //-- 统计结束时间
  //     dailyRegCnt: 100123, //-- 昨日注册人数
  //     dailyDepositCnt: 30, //-- 昨日入金人数
  //     dailyTradeCnt: undefined, //-- 昨日交易人数
  //     dailyRebate: 99.12345678, //-- 昨日返佣
  //     weeklyRebate: 99.1, //-- 本周累计返佣
  //     totalRebate: 76546781234.5435678, //-- 历史累计返佣
  //   },
  // };
}

//  合伙人考核进度
export async function assessSchedule() {
  return pull(`${prefix}/v2/affiliate/assess/schedule`);

  // return {
  //   success: true,
  //   code: '200',
  //   msg: 'success',
  //   retry: false,
  //   data: {
  //     isNewAffiliate: false,
  //     type: 'QUARTER', //-- 当前进度 MONTH/QUARTER
  //     assessCycle: '20231',
  //     startDate: 1681315200000, //-- 开始时间
  //     endDate: 1681315200000, //-- 计数时间
  //     preLevel: 2, //-- 预估level
  //     preAmount: 99.12345678, //-- 预估交易额
  //     preFtt: 99, //-- 预估ftt
  //     nextLevel: 3, //-- 进阶level
  //     nextAmount: 99.12345678, //-- 进阶所需交易额
  //     nextFtt: 99, //-- 进阶所需ftt
  //   },
  // };
}

// 统计数据概览
export async function statDataOverview(data) {
  return pull(`${affiliatePrefix}/v2/affiliate/statData/overview`, data);

  // return {
  //   success: true,
  //   code: '200',
  //   msg: 'success',
  //   retry: false,
  //   // data: null,
  //   data: {
  //     directNumber: 0, //--直接邀请人数
  //     secondNumber: '65676', //--二级合伙人邀请人数
  //     totalNumber: null, //--总邀请人数
  //     directRebate: '1343434340.0001', //--直接返佣
  //     secondRebate: '10.00', //--二级返佣
  //     totalRebate: '0', //--总返佣
  //     depositAmount: '0', //--总入金
  //     depositCnt: 10, //--入金人数
  //     firstDepositCnt: 2, //--首次入金人数
  //     tradeAmount: 0, //--交易额
  //     tradeCnt: 10, //--交易人数
  //     firstTradeCnt: 2, //--首次交易人数
  //     directAmount: '1000.01',
  //     secondAmount: '1000.01',
  //     totalAmount: '2000.02',
  //     directFee: '300.01',
  //     secondFee: '300.01',
  //     totalFee: '600.02',
  //   },
  // };
}

// 返佣数据概览
export async function rebateDataOverview() {
  return pull(`${affiliatePrefix}/v2/affiliate/rebateData/overview`);

  // return {
  //   success: true,
  //   code: '200',
  //   msg: 'success',
  //   retry: false,
  //   data: {
  //     waitSettleRebate: 20.37031356, //--待结算返佣
  //     settleStartTime: 1683207014000, //--待结算返佣统计开始时间
  //     settleEndTime: 1683207014000, //--待结算返佣统计结束时间
  //     waitSendRebate: 20.37031356, //--待发放返佣
  //     issueTime: 1683207014000, //--预计发奖时间
  //     totalRebate: 20.37031356, //--已发佣金
  //     rebateStartTime: 1683207014000, //--已发佣金统计开始时间
  //     rebateEndTime: 1683207014000, //--已发佣金统计结束时间
  //     refreshDate: 1683207014000, //--数据刷新时间
  //   },
  // };
}

// 返佣发放记录
export async function rebateList(data) {
  return pull(`${affiliatePrefix}/v2/affiliate/rebate/list`, data);

  // return {
  //   msg: 'success',
  //   code: '200',
  //   totalNum: 2,
  //   success: true,
  //   totalPage: 1,
  //   pageSize: 10,
  //   currentPage: 1,
  //   items: [
  //     {
  //       issueTime: 1683207014000, //--发放时间
  //       issueType: 'WEEK', //--发放类型
  //       rewardStartTime: 1683207014000, //--佣金统计周期开始时间
  //       rewardEndTime: 1683207014000, //--佣金统计周期结束时间
  //       directRebate: '5.1234', //-– 直接返佣
  //       secondRebate: '5.12345678', //--二级返佣
  //       backFee: '10.12345678', //--返现
  //       totalSendAmount: '20.37031356', //--应发总佣金
  //       status: 'WAIT', //--发放状态
  //       actualRebateAmount: '20.37031356', //--实发金额
  //       createTime: 1683206362000,
  //     },
  //     {
  //       issueTime: 1683207014000, //--发放时间
  //       issueType: 'WEEK', //--发放类型
  //       rewardStartTime: 1683207014000, //--佣金统计周期开始时间
  //       rewardEndTime: 1683207014000, //--佣金统计周期结束时间
  //       directRebate: '5.1234', //-– 直接返佣
  //       secondRebate: '5.12345678', //--二级返佣
  //       backFee: '10.12345678', //--返现
  //       totalSendAmount: '20.37031356', //--应发总佣金
  //       status: 'FAIL', //--发放状态
  //       actualRebateAmount: '20.37031356', //--实发金额
  //       createTime: 1683206363000,
  //     },
  //     {
  //       issueTime: 1683207014000, //--发放时间
  //       issueType: 'WEEK', //--发放类型
  //       rewardStartTime: 1683207014000, //--佣金统计周期开始时间
  //       rewardEndTime: 1683207014000, //--佣金统计周期结束时间
  //       directRebate: '5.1234', //-– 直接返佣
  //       secondRebate: '5.12345678', //--二级返佣
  //       backFee: '10.12345678', //--返现
  //       totalSendAmount: '20.37031356', //--应发总佣金
  //       status: 'SUCCESS', //--发放状态
  //       actualRebateAmount: '20.37031356', //--实发金额
  //       createTime: 1683206364000,
  //     },
  //   ],
  //   retry: false,
  // };
}

// 返佣发放记录导出任务创建
export async function exportGenerate(data) {
  return post(`${affiliatePrefix}/v2/affiliate/rebate/export/generate`, data, false, true);
  // console.log('exportGenerate---------');
  // return new Promise((r) => {
  //   setTimeout(() => {
  //     r({
  //       success: true,
  //       code: '200',
  //       msg: 'success',
  //       retry: false,
  //       data: true,
  //     });
  //   }, 300);
  // });
}

// 5.5 返佣发放记录导出任务记录
export async function exportList(data) {
  return pull(`${affiliatePrefix}/v2/affiliate/rebate/export/list`, data);
  console.log('exportList---------');
  // return new Promise((r) => {
  //   setTimeout(() => {
  //     r({
  //       success: true,
  //       code: '200',
  //       msg: 'success',
  //       retry: false,
  //       currentPage: 1,
  //       pageSize: 10,
  //       totalNum: 300000,
  //       totalPage: 1,
  //       items: [
  //         // {
  //         //   id: '64584c49c2167000015b765a',
  //         //   status: 1,
  //         //   fileUrl: null,
  //         //   createdAt: 1683508297000,
  //         //   begin: 1680883200000,
  //         //   end: 1683561600000,
  //         //   message: null,
  //         // },
  //         // {
  //         //   id: '64584c49c2167000015b765a2',
  //         //   status: 2,
  //         //   fileUrl: 'https://www.kucoin.com/zh-hant',
  //         //   createdAt: 1683508297000,
  //         //   begin: 1680883200000,
  //         //   end: 1683561600000,
  //         //   message: null,
  //         // },
  //         // {
  //         //   id: '64584c49c2167000015b765a1',
  //         //   status: 3,
  //         //   fileUrl: null,
  //         //   createdAt: 1683508297000,
  //         //   begin: 1680883200000,
  //         //   end: 1683561600000,
  //         //   message: null,
  //         // },
  //         // {
  //         //   id: '64584c49c2167000015b765',
  //         //   status: 3,
  //         //   fileUrl: null,
  //         //   createdAt: 1683508297000,
  //         //   begin: 1680883200000,
  //         //   end: 1683561600000,
  //         //   message: null,
  //         // },
  //         // {
  //         //   id: 'wq',
  //         //   status: 3,
  //         //   fileUrl: null,
  //         //   createdAt: 1683508297000,
  //         //   begin: 1680883200000,
  //         //   end: 1683561600000,
  //         //   message: null,
  //         // },
  //         // {
  //         //   id: 'wqw',
  //         //   status: 3,
  //         //   fileUrl: null,
  //         //   createdAt: 1683508297000,
  //         //   begin: 1680883200000,
  //         //   end: 1683561600000,
  //         //   message: null,
  //         // },
  //       ],
  //     });
  //   }, 2300);
  // });
}

// 数据刷新时间
export async function affiliateRefreshData(data) {
  return pull(`${affiliatePrefix}/v2/affiliate/data/refresh`, data);
}

// 未读消息
export async function exportMsg(data) {
  return pull(`${affiliatePrefix}/v2/affiliate/export/message`, data);

  // return {
  //   success: true,
  //   code: '200',
  //   msg: 'success',
  //   retry: false,
  //   data: {
  //     hasNewMsg: true,
  //     status: 1,
  //     fileUrl: null,
  //   },
  // };
}

// 已读消息
export async function exportMsgRead(data) {
  return post(`${affiliatePrefix}/v2/affiliate/export/message/read`, data);
}
