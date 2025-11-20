/**
 * Owner: iron@kupotech.com
 */
import { get } from '@tools/request';

// 查询用户信息
export const getUserInfo = () => get('/ucenter/user-info');

// 获取用户已经认证的部分
export function getSecurityMethods() {
  return get('/ucenter/user/security-methods');
}
