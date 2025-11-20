/**
 * Owner: iron@kupotech.com
 */
import { post, get } from '@tools/request';

// 查询用户信息
export const getUserInfo = () => get('/ucenter/user-info');

// 发送邮箱验证码
export function setTradePasswordPost(params) {
  return post('/ucenter/user/withdraw-password', params, true);
}
