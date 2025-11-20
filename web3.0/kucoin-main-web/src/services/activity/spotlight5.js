/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';
import { ActivityType } from 'config/base';

const type = ActivityType.SPOTLIGHT5;

/**
 * 获取spotlight活动规则
 * @param campaignId 活动ID
 */
export function getSpotlightInfo(campaignId) {
  return pull('/spotlight/getInfo', {
    campaignId,
    type,
  });
}

/**
 * 查询spotlight资格
 * @param campaignId 活动ID
 */
export function getSpotlightQualification(campaignId) {
  return pull('/spotlight/getQualification', { campaignId, type });
}

/**
 * 查询中签信息
 * @param campaignId 活动ID
 */
export function getWinningInfo(campaignId) {
  return pull('/spotlight/getWinningInfo', { campaignId, type });
}

/**
 * 预约
 * @param {*} campaignId 活动ID
 */
export function reservation(campaignId) {
  return post(`/spotlight/reservation?type=${type}`, { campaignId });
}

/**
 * 签署协议
 * @param {*} campaignId
 */
export function signAgreement(campaignId) {
  return post(`/spotlight/signAgreement?type=${type}`, { campaignId });
}

/**
 * 签署国家确认协议
 * @param {*} campaignId
 */
export function signCountryAgreement(campaignId) {
  return post(`/spotlight/signCountryAgreement?type=${type}`, { campaignId });
}
