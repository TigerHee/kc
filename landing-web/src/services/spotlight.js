/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';

/**
 * 获取spotlight活动规则
 * @param campaignId 活动ID
 */
export function getSpotlightInfo(campaignId) {
  return pull('/spotlight/spotlight/getInfo', { campaignId });
}

/**
 * 查询spotlight资格
 * @param campaignId 活动ID
 */
export function getSpotlightQualification(campaignId) {
  return pull('/spotlight/spotlight/getQualification', { campaignId });
}

/**
 * 获取抢单列表
 * @param {*} campaignId 活动ID
 */
export function getHistoryList(campaignId) {
  return pull('/spotlight/spotlight/getOrderList', {});
}

/**
 * 签署协议
 * @param {*} campaignId
 */
export function signAgreement(campaignId) {
  return post('/spotlight/spotlight/signAgreement', { campaignId });
}

/**
 * 下单
 * @param {*} campaignId
 * @param {*} currency 资产代码
 * @param {*} verification
 */
export async function order(campaignId, currency, verification) {
  // const { protocol, host } = window.location;
  // const prefix = `${protocol}//${host}`;
  // waf path，动态获取下单接口
  const { data } = await pull('/spotlight/spotlight/getOrderPathUUID', { campaignId, type: 8 });
  return post(`/spotlight/spotlight/${data}`, {
    campaignId, verification, type: 8,
  });
}
