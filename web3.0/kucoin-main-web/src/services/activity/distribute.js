/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';

/**
 * 获取spotlight活动规则
 * @param campaignId 活动ID
 */
export function getDistributeInfo(campaignId) {
  return pull('/spotlight/spotlight/getInfo', { campaignId, type: 12 });
}

/**
 * 获取抢单列表
 * @param {*} campaignId 活动ID
 */
export function getHistoryList(campaignId) {
  return pull('/spotlight/spotlight/getOrderList', { campaignId });
}

/**
 * 查询spotlight资格
 * @param campaignId 活动ID
 */
export function getQualification({ campaignId, type }) {
  return pull('/spotlight/spotlight/getQualification', { campaignId, type });
}

// /**
//  * 下单
//  * @param {*} campaignId
//  * @param {*} currency 资产代码
//  * @param {*} size 购买份数
//  */
// export async function order(campaignId, currency, size) {
//   const { protocol, host } = window.location;
//   const prefix = `${protocol}//${host}`;
//   // waf path，动态获取下单接口
//   const { data } = await pull(`${prefix}/spotlight/url`);
//   return post(data, { campaignId, currency, size });
// }

/**
 * 下单
 * @param {*} campaignId
 * @param {*} currency 资产代码
 * @param {*} verification
 */
export async function order(campaignId, verification) {
  // const { protocol, host } = window.location;
  // const prefix = `${protocol}//${host}`;
  // // waf path，动态获取下单接口
  const { data } = await pull('/spotlight/spotlight/getOrderPathUUID', { campaignId, type: 12 });
  // return post(data, { campaignId, currency, verification, type: 12 });
  return post(`/spotlight/spotlight/${data}`, {
    campaignId,
    verification,
    type: 12,
  });
}
