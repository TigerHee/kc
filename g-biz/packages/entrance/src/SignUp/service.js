/**
 * Owner: iron@kupotech.com
 */
import { post, get } from '@tools/request';
// 获取验证码(根据后端要求，register-email 用post, register-short-message 用get)

// 查询用户信息
export const getUserInfo = () => get('/ucenter/user-info');

// 发送邮箱验证码
export function sendEmailVerifyCode(param) {
  return post('/ucenter/register-email', param, true);
}

// 发送短信验证码
export function sendPhoneVerifyCode(param) {
  return get('/ucenter/register-short-message', param, true);
}

// 校验验证码是否OK
export function verifyCode(param) {
  return post('/ucenter/sign-up-validation', param, true);
}

// 手机注册 必须要绑定邮箱
export function signUpPhoneEmail(param) {
  return post('/ucenter/sign-up-phone-email', param, true);
}

// 邮箱注册
export function signUpEmail(param) {
  return post('/ucenter/sign-up-email', param, true);
}

// 手机注册
export function signUpPhone(param) {
  return post('/ucenter/sign-up-phone', param, true);
}

// 获取区号列表
export function getCountryCodes() {
  return get('ucenter/country-codes');
}

export async function getRefer(referrerCode) {
  return get('ucenter/user/referrer-info', { referrerCode });
}

// 邮箱召回
export const postEmailRecall = (payload) => post(`/market-operation/recalled-email`, payload, true);

// 手机召回
export const postPhoneRecall = (payload) => post(`/market-operation/recalled-phone`, payload, true);

// 获取邮箱后缀
export const getEmailSuffixes = (payload) => get(`/market-operation/mail-suffixes`, payload);

// 查询封禁信息
export const queryForceKycInfo = (params) => get('/user-dismiss/ip-dismiss/notice', params);

// 从admin，获取注册引导弹窗文案
export const getRegGuideTextApi = (params) => {
  return get('/growth-config/get/client/config/codes', params);
};

// 绑定三方账号
export const bindThirdParty = (payload) => post(`/ucenter/external-register`, payload);

export const getUserByRCode = ({ rcode }) => {
  return get('/growth-ucenter/invitation/user-by-rcode', { rcode });
};

// 获取注册 kyc 福利
export function getSignupKycBenefits() {
  return get('/platform-reward/newcomer/config');
}
