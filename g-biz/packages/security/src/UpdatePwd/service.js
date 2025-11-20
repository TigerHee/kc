/**
 * Owner: iron@kupotech.com
 */
import { get, post } from '@tools/request';

// 查询用户信息
export const getUserInfo = () => get('/ucenter/user-info');

// 发送邮箱验证码
export function updatePasswordPost(params) {
  return post('/ucenter/user/password/update', params, true);
}
