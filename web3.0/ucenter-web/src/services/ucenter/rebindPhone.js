/**
 * Owner: willen@kupotech.com
 */
import { post, pull } from 'tools/request';

const prefix = '/ucenter';
/**
 * 解绑定谷歌两步验证--需要上报设备指纹
 */
export async function rebindPhone(data) {
  return post(`${prefix}/rebind-phone/apply`, data);
}
/**
 * 查询申请状态
 */
export function pullPhoneStatus(query) {
  return pull(`${prefix}/apply/rebind-phone-result`, query);
}

/**
 * 查询用户设置了哪些安全保护措施,主要是看有没有绑定谷歌
 */
export function pullMethods({ token }) {
  return pull(`${prefix}/user/whitelist/security-methods/${token}`);
}
