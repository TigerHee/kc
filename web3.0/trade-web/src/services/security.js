/**
 * Owner: borden@kupotech.com
 */
import { post, pull } from 'utils/request';

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
export async function sendPhoneBindCode({ phone, countryCode, bizType = 'BIND_PHONE' }) {
  return pull(`${prefix}/bind-phone/code`, {
    phone,
    countryCode,
    bizType,
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
 * 修改绑定邮箱
 */
export async function updateEmail({ email, code }) {
  return post(`${prefix}/user/email/update`, {
    email,
    code,
  });
}

/**
 * 绑定手机
 */
export async function bindPhone({ phone, code, countryCode }) {
  return post(`${prefix}/user/phone`, {
    phone,
    code,
    countryCode,
  });
}

/**
 * 修改绑定手机
 */
export async function updatePhone({ phone, code, countryCode }) {
  return post(`${prefix}/user/phone/update`, {
    phone,
    code,
    countryCode,
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
 * 更新用户登录密码
 * @param {*} param0
 */
export async function updatePwd({ newPassword, oldPassword }) {
  return post(`${prefix}/user/password/update`, {
    newPassword, oldPassword,
  });
}

/**
 * 设置提现密码
 * @param {*} withdrawPassword
 */
export async function setWithdrawPassword(withdrawPassword) {
  return post(`${prefix}/user/withdraw-password`, { withdrawPassword });
}

/**
 * 更新提现密码
 * @param {*} withdrawPassword
 */
export async function updateWithdrawPassword(withdrawPassword, oldWithdrawPassword) {
  return post(`${prefix}/user/withdraw-password/update`, { withdrawPassword, oldWithdrawPassword });
}

/**
 * 绑定google 验证
 * @param {*} param0
 */
export async function bindG2AF({ code, key, isUpdate = false }) {
  const path = isUpdate ? '/user/google2fa/update' : '/user/google2fa';
  return post(`${prefix}${path}`, { code, key });
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
  return pull(`${prefix}/check-required-validations`, { ...params, seq: 1 });
}

/**
 *@description 用户申请重置交易密码
 * @param backPic 证件照背面
 * @param frontPic 证件照正面
 * @param handPic 手持证件照
 * @return {Promise<*>}
 */
export async function applyResetWithDrawPassword({ backPic, frontPic, handPic }) {
  return post(`${prefix}/reset-trade-password/apply`, { backPic, frontPic, handPic });
}

/**
 * @description 用户获取重置交易密码信息
 */
export async function getResetWithDrawPasswordInfo() {
  return pull(`${prefix}/reset-trade-password/info`);
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
