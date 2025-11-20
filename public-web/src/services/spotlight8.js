/**
 * Owner: jessie@kupotech.com
 */
import config from 'config';
import { post as postForm, postJson as post, pull } from 'tools/request';

const {
  v2ApiHosts: { CMS },
} = config;

/**
 * @description 获取活动页面详情接口
 * @param id
 * @return {*}
 */
export function pullPage({ id }) {
  return pull(`${CMS}/cms/activity/${id}`);
}

/**
 * 根据活动id查询spotlight7活动详情
 * @param campaignId 活动ID
 */
export function getSpotlightInfo(campaignId) {
  return pull('/spotlight/spotlight8/campaignInfo', { campaignId });
}

/**
 * 查询spotlight7活动资格达成情况
 * @param campaignId 活动ID
 */
export function getSpotlightQualification(campaignId) {
  return pull('/spotlight/spotlight8/qualification', { campaignId });
}

/**
 * 参与人数统计
 * @param {*} campaignId
 */
export function getActivitySubcribeCount(campaignId) {
  return pull('/spotlight/spotlight8/summary', { campaignId });
}

/**
 * 用户申购信息
 * @param {*} campaignId
 */
export function getUserSubcribeInfo(campaignId) {
  return pull('/spotlight/spotlight8/invest/detail', { campaignId });
}

/**
 * 申购
 * @param {*} campaignId 活动ID
 * @param {*} campaignPeriodicId 活动周期ID
 * @param {*} subAmount 申购金额
 * @param {*} subToken 申购TOKEN
 */
export function subcribe(params) {
  return post('/spotlight/spotlight8/sub', params);
}

/**
 * 签署协议
 * @param {*} campaignId
 */
export function signAgreement(campaignId) {
  return post(`/spotlight/spotlight8/agreement?campaignId=${campaignId}`);
}

/**
 * 签署国家确认协议
 * @param {*} campaignId
 */
export function signCountryAgreement(campaignId) {
  return post(`/spotlight/spotlight8/countryAgreement?campaignId=${campaignId}`);
}

/**
 * 根据活动id查询spotlight7活动申购记录
 * @param campaignId 活动ID
 * @param page
 * @param pageSize
 */
export function getSubRecord(params) {
  return pull(`/spotlight/spotlight8/subRecord`, params);
}

/**
 * 获取预约状态
 * @param campaignId 活动ID
 * @returns
 */
export function getReserveStatus(campaignId) {
  return pull(`/spotlight/spotlight8/reserve/query`, { campaignId });
}

/**
 * 预约活动
 * @param campaignId 活动ID
 * @returns
 */
export function submitReserve(campaignId) {
  return postForm(`/spotlight/spotlight8/reserve/submit`, { campaignId });
}

/**
 * 领取奖励
 * @param {string} campaignId 活动ID
 * @returns {Promise<Object>} 返回奖励相关信息
 * @returns {string} response.refundAmount - 认购退回金额
 * @returns {number} response.rewardAmount - 奖励信息金额
 * @returns {boolean} response.rewardConfirmed - 奖励信息是否已确认
 * @returns {string} response.rewardToken - 奖励币种信息
 * @returns {string} response.subAmount - 认购支付金额
 * @returns {string} response.subCurrency - 认购支付币种
 * @returns {number} response.subPrice - 认购价格
 */
export function getReward(campaignId) {
  return pull(`/spotlight/spotlight8/reward/confirm`, { campaignId });
}

/**
 * 领取奖励
 * @param {*} campaignId
 * {
 *  "code": "string",
 *  "data": true,
 *  "msg": "string",
 *  "retry": true,
 *  "success": true
 * }
 */
export function postReward(campaignId) {
  return post(`/spotlight/spotlight8/reward/confirm?campaignId=${campaignId}`);
}
