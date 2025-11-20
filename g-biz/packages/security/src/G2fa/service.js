/**
 * Owner: iron@kupotech.com
 */
import { get, post } from '@tools/request';

// 查询用户信息
export const getUserInfo = () => get('/ucenter/user-info');

// 获取用户已经认证的部分
export function getSecurityMethods() {
  return get('/ucenter/user/security-methods');
}

// 获取google 两步验证key
export function getG2faKey(params) {
  return get('/ucenter/google2fa', params);
}

// 绑定谷歌两步验证
export function bindG2faPost(params) {
  return post('/ucenter/user/google2fa', params, true);
}

// 修改谷歌两部验证
export function updateG2faPost(params) {
  return post('/ucenter/user/google2fa/update', params, true);
}

// 发送邮箱验证码
export function sendEmailCodePost(params) {
  return post('/ucenter/send-validation-code', params, true);
}

// 校验验证码
export function verifyCodePost(params) {
  return post('/ucenter/verify-validation-code', params, true);
}
