/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';

/**
 * 获取spotlight活动规则
 * @param campaignId 活动ID
 */
export function getSpotlightInfo(campaignId) {
  return pull('/spotlight/getInfo', { campaignId });
}

/**
 * 查询spotlight资格
 * @param campaignId 活动ID
 */
export function getSpotlightQualification(campaignId) {
  return pull('/spotlight/getQualification', { campaignId });
}

/**
 * 查询中签信息
 * @param campaignId 活动ID
 */
export function getWinningInfo(campaignId) {
  return pull('/spotlight/getWinningInfo', { campaignId });
}

/**
 * 预约
 * @param {*} campaignId 活动ID
 */
export function reservation(campaignId) {
  return post('/spotlight/reservation', { campaignId });
}

/**
 * 签署协议
 * @param {*} campaignId
 */
export function signAgreement(campaignId) {
  return post('/spotlight/signAgreement', { campaignId });
}
