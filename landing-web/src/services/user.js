/**
 * Owner: jesse.shao@kupotech.com
 */
import _ from 'lodash';
import { pull, post } from 'utils/request';
import { getUcenterUserInfo } from './ucenterUserInfo';

const prefix = '/ucenter';

// 获取用户信息
export const pullUserInfo = getUcenterUserInfo;

// 获取csrf token
export async function pullCsrf() {
  return pull('/csrftoken');
}

// 查询用户设置了哪些安全保护措施以及是否进行过KYC
export async function pullSecurtyMethods(userId) {
  return pull(`${prefix}/user/security-methods`, { userId });
}

// 保存用户的本地化设置
export async function setLocal(params) {
  return post(`${prefix}/user/locale`, params);
}

export async function setUserCookie(params) {
  const _params = {};

  let index = 0;
  _.each(params, (value, key) => {
    _params[`key[${index}]`] = key;
    _params[`value[${index}]`] = value;
    index += 1;
  });
  // TODO 需要吗？？
  // return post(`${MAINSITE_HOST}/api/v1/cms/cookies`, _params);
}

// 退出登录
export async function logout() {
  return post('/logout');
}

// 发送验证码
export async function sendValidateCode(data) {
  return post(`${prefix}/send-validation-code`, data);
}
// 校验验证码
export async function verifyValidateCode(data) {
  return post(`${prefix}/verify-validation-code`, data);
}

// 发送绑定手机验证码
export async function sendBindPhoneCode(data) {
  return pull(`${prefix}/bind-phone/code`, data);
}

// 绑定手机号
export async function bindPhone(data) {
  return post(`${prefix}/user/phone`, data);
}

// 获取国家代码
export async function getCountryCodes(data) {
  return pull(`${prefix}/country-codes`, data);
}

// 获取安全绑定状态
export async function getSecurityBindStatus() {
  return pull(`${prefix}/user/security-methods`);
}

// 获取kyc信息
export async function getKycInfo() {
  return pull(`${prefix}/kyc/info`);
}

// 查询封禁信息
// 入参支持多个bizType，以英文逗号分隔，如：IP_DIALOG, IP_TOP_MESSAGE, REGISTER
export function queryIpDismiss(params) {
  return pull('/user-dismiss/ip-dismiss/notice', params);
}
