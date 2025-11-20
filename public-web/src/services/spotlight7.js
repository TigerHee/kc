/**
 * Owner: jessie@kupotech.com
 */
import config from 'config';
import { postJson as post, pull } from 'tools/request';

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
  return pull('/spotlight/spotlight7/campaignInfo', { campaignId });
}

/**
 * 查询spotlight7活动资格达成情况
 * @param campaignId 活动ID
 */
export function getSpotlightQualification(campaignId) {
  return pull('/spotlight/spotlight7/qualification', { campaignId });
}

/**
 * 参与人数统计
 * @param {*} campaignId
 */
export function getActivitySubcribeCount(campaignId) {
  return pull('/spotlight/spotlight7/summary', { campaignId });
}

/**
 * 申购
 * @param {*} campaignId 活动ID
 * @param {*} campaignPeriodicId 活动周期ID
 * @param {*} subAmount 申购金额
 * @param {*} subToken 申购TOKEN
 */
export function subcribe(params) {
  const url = params.period? `/spotlight/spotlight7/formal/sub`:`/spotlight/spotlight7/presale/sub`;
  return post(url, params);
}

/**
 * 签署协议
 * @param {*} campaignId
 */
export function signAgreement(campaignId) {
  return post(`/spotlight/spotlight7/agreement?campaignId=${campaignId}`);
}

/**
 * 签署国家确认协议
 * @param {*} campaignId
 */
export function signCountryAgreement(campaignId) {
  return post(`/spotlight/spotlight7/countryAgreement?campaignId=${campaignId}`);
}

/**
 * 活动申购周期列表
 * @param {*} campaignId
 */
// export function getCycleList(campaignId) {
//   return pull('/spotlight/spotlight7/periodicList', { campaignId });
// }


/**
 * /根据活动id查询spotlight7 pumpfun活动信息
 * @param {*} campaignId
 */
export function getTabData(campaignId) {
  return pull('/spotlight/spotlight7/queryPumpfunCampaignInfo', { campaignId });
}

/**
 * 查看是否有可用交易对
 * @param {*} currency
 */
export function getVaildSymbol(currency) {
  return pull('/spotlight/spotlight7/getSymbols', { currency });
}

/**
 * 根据活动id查询spotlight7活动申购记录
 * @param campaignId 活动ID
 * @param page
 * @param pageSize
 */
export function getSubRecord(params) {
  return pull(`/spotlight/spotlight7/pumpfunSubRecord`, params);
}
