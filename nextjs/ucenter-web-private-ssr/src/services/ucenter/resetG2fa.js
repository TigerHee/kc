/**
 * Owner: willen@kupotech.com
 */
import { post, pull } from 'tools/request';

const prefix = '/ucenter';
/**
 * 解绑定谷歌两步验证--需要上报设备指纹
 */
export async function resetG2fa(data) {
  return post(`${prefix}/g2fa/apply`, data);
}

/**
 * 查询申请状态
 */
export function pullG2faStatus(query) {
  return pull(`${prefix}/apply/g2fa-result`, query);
}

/**
 * 手机重置谷歌验证
 */
export async function resetG2fa2({ token }) {
  return post(`${prefix}/g2fa/reset?token=${token}`);
}
