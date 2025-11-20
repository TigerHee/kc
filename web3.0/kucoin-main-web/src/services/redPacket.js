/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';

const prefix = '/welfare';

// 获取红包信息
export async function pullRedPacketInfo(payload) {
  return pull(`${prefix}/web/get-welfare`, payload);
}

// 领取-手机号领取
export async function getRewardByPhone(payload) {
  return post(`${prefix}/web/receive2phone`, { ...payload, channel: 'WEB' });
}
// 底部数据-通过手机号查询状态下--（已经领取2/3个，总计500kcs）
export async function queryRecord({ countryCode, phone, sendRecordId }) {
  return pull(`${prefix}/web/welfare-detail-phone`, { countryCode, phone, sendRecordId });
}
// 领取--登录领取
export async function getRewardByLogin({ code }) {
  return post(`${prefix}/web/receive2code`, { code, channel: 'WEB' });
}

// 底部数据-登录状态下-（已经领取2/3个，总计500kcs）
export async function queryRecordbyLogin({ sendRecordId }) {
  return pull(`${prefix}/web/welfare-detail`, { sendRecordId });
}

// 该红包所有领取记录
export async function getReceiveList(params) {
  return pull(`${prefix}/web/welfare-detail/hasMore`, params);
}
