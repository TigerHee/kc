/**
 * Owner: jessie@kupotech.com
 */
import config from 'config';
import { postJson as post, pull } from 'tools/request';
import { isOnCache } from 'utils/pullCache';

const {
  v2ApiHosts: { CMS },
} = config;

/**
 * @description 获取活动页面详情接口
 * @param id
 * @return {*}
 */
export function pullPage({ id }) {
  const onCache = isOnCache();

  const url = onCache ? `${CMS}/kcscache/cms/activity/${id}` : `${CMS}/cms/activity/${id}`;
  return pull(url);
}

/**
 * @deprecated 活动前端-cms列表信息
 * @param page
 * @param pageSize
 * @param {*} param0
 */
export function pullActivityList({ page, pageSize }) {
  return pull('/promotion/campaign/cms', { page, pageSize });
}

/**
 * 根据活动id查询spotlight6活动
 * @param campaignId 活动ID
 */
export function getSpotlightInfo(campaignId) {
  return pull(`/spotlight/spotlight6/${campaignId}`);
}

/**
 * 查询spotlight6活动资格达成情况
 * @param campaignId 活动ID
 */
export function getSpotlightQualification(campaignId) {
  return pull(`/spotlight/spotlight6/${campaignId}/qualification`);
}

/**
 * 查询spotlight6活动中签彩票数量
 * @param campaignId 活动ID
 */
export function getTickets(campaignId) {
  return pull(`/spotlight/spotlight6/${campaignId}/tickets`);
}

/**
 * 查询活动报名人数
 * @param {*} campaignId
 */
export function getActivityRegistrationCount(campaignId) {
  return pull(`/spotlight/spotlight6/${campaignId}/summary`);
}

/**
 * 预约
 * @param {*} campaignId 活动ID
 */
export function reservation(campaignId) {
  return post(`/spotlight/spotlight6/${campaignId}`);
}

/**
 * 签署协议
 * @param {*} campaignId
 */
export function signAgreement(campaignId) {
  return post(`/spotlight/spotlight6/${campaignId}/agreement`);
}

/**
 * 签署国家确认协议
 * @param {*} campaignId
 */
export function signCountryAgreement(campaignId) {
  return post(`/spotlight/spotlight6/${campaignId}/countryAgreement`);
}
