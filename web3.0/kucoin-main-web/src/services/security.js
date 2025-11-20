/**
 * Owner: willen@kupotech.com
 */
import { post, pull as originPull } from 'tools/request';
import { pullWrapper } from 'utils/pullCache';

const pull = pullWrapper(originPull);

const prefix = '/ucenter';

/**
 * 校验
 * @param data
 * @returns {Promise<*>}
 */
export async function verify(data) {
  return post(`${prefix}/verify-validation-code`, data);
}

/**
 * 获取验证码
 * @param {*} type register-email/register-short-message
 */
export async function getValidationCode(data) {
  return post(`${prefix}/send-validation-code`, data);
}

/**
 * 发送绑定邮箱地址的CODE
 */
export async function sendEmailBindCode({ email, bizType = 'BIND_EMAIL' }) {
  return post(`${prefix}/bind-email/code`, {
    bizType,
    email,
  });
}

/**
 * 发送绑定手机号的CODE
 */
export async function sendPhoneBindCode({
  phone,
  countryCode,
  sendChannel,
  bizType = 'BIND_PHONE',
}) {
  return pull(`${prefix}/bind-phone/code`, {
    phone,
    countryCode,
    bizType,
    sendChannel,
  });
}

/**
 * 绑定邮箱
 */
export async function bindEmail({ email, code }) {
  return post(`${prefix}/user/email`, {
    email,
    code,
  });
}

/**
 * 绑定手机
 */
export async function bindPhone({ phone, code, countryCode, sendChannel }) {
  return post(`${prefix}/user/phone`, {
    phone,
    code,
    countryCode,
    validationType: sendChannel,
  });
}

/**
 * 获取谷歌两步验证key
 * @returns {Promise<*>}
 */
export async function getG2FAKey() {
  return pull(`${prefix}/google2fa`);
}

/**

 * @description 查询用户设置了哪些安全保护措施以及是否进行过KYC
 * @return {Promise<*>}
 */
export async function getSeMethod() {
  return pull(`${prefix}/user/security-methods`);
}

/**
 * 设置提现密码
 * @param {*} withdrawPassword
 */
export async function setWithdrawPassword(withdrawPassword) {
  return post(`${prefix}/user/withdraw-password`, { withdrawPassword });
}

/**
 * 设置邮件安全语
 * @param {*} opts
 */
export async function saveSafewords(opts) {
  return post(`${prefix}/user/safe-words`, {
    ...opts,
  });
}

/**
 * 获取邮件安全语
 */
export async function getSafeWords() {
  return pull(`${prefix}/user/safe-words`);
}

/**
 * @description 检验需要验证的类型
 * @param bizType
 * @return {Promise<*>}
 */
export async function checkValidations(params) {
  return originPull(`${prefix}/check-required-validations`, { ...params, seq: 1 });
}

/**
 * @description 获取安全问题列表
 */
export async function getQuestionList() {
  return pull(`${prefix}/security-questions`);
}

/**
 * @description 升级提现密码
 * @param withdrawPassword
 */
export async function upgradePassword({ withdrawPassword }) {
  return post(`${prefix}/transfer/upgrade-withdraw-password`, { withdrawPassword });
}

export async function updateLoginIp(params) {
  return post(`${prefix}/update-login-ip-protect`, params);
}

export async function getNoticeStatus() {
  return pull(`${prefix}/is-need-balance-notice`);
}

export async function closeNotice() {
  return post(`${prefix}/disable-asserts-security-tip`);
}

export async function cancellation(params) {
  return post('/user-biz-front/user/cancellation/v2', params);
}

export async function freezeSelf() {
  return pull(`${prefix}/user/apply-freeze`);
}

/**
 * KYC0 KYC1: 人脸识别的照片和证件正面照比对
 */
export function checkFacePic(query) {
  return post(`${prefix}/self/face-match`, query, false, true);
}

/**
 * KYC2: 人脸识别的照片和KYC照片比对
 */
export function checkFaceKYC(query) {
  return post(`${prefix}/self/face-match/face-only`, query, false, true);
}

/**
 * 获取智能客服服务开关
 */
export function getConfig() {
  return pull(`${prefix}/query/config`);
}
