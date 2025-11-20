/**
 * Owner: willen@kupotech.com
 */
import { ZArticlesLangs } from 'config/base';
import { getCurrentLangFromPath } from 'tools/i18n';
import { post, postV2, pull as originPull } from 'tools/request';
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
export async function bindEmail({ email, code, headers }) {
  return post(
    `${prefix}/v2/user/email`,
    {
      email,
      code,
    },
    false,
    false,
    headers,
  );
}

/**
 * 修改绑定邮箱
 */
export async function updateEmail({ email, code, headers }) {
  return post(
    `${prefix}/v2/user/email/update`,
    {
      email,
      code,
    },
    false,
    false,
    headers,
  );
}

/**
 * 绑定手机
 */
export async function bindPhone({ phone, code, countryCode, sendChannel, headers }) {
  return post(
    `${prefix}/v2/user/phone`,
    {
      phone,
      code,
      countryCode,
      validationType: sendChannel,
    },
    false,
    false,
    headers,
  );
}

/**
 * 修改绑定手机
 */
export async function updatePhone({ phone, code, countryCode, sendChannel, headers }) {
  return post(
    `${prefix}/v2/user/phone/update`,
    {
      phone,
      code,
      countryCode,
      validationType: sendChannel,
      verifyCode: true,
    },
    false,
    false,
    headers,
  );
}

/**
 * 修改绑定手机
 */
export async function updatePhoneV2({ phone, code, countryCode, headers }) {
  return postV2({
    url: `${prefix}/v2/user/phone/update`,
    data: {
      phone,
      code,
      countryCode,
      verifyCode: true,
    },
    headers,
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
 * 三方极简注册 用户设置登录密码
 * @param {*} param0
 */
export async function setPwd({ password, headers }) {
  return postV2({
    url: `${prefix}/user/password`,
    data: {
      password,
    },
    headers,
  });
}

/**
 * 更新用户登录密码
 * @param {*} param0
 */
export async function updatePwd({ password, headers }) {
  return post(
    `${prefix}/v2/user/password/update`,
    {
      newPassword: password,
    },
    false,
    false,
    headers,
  );
}

/**
 * 设置提现密码
 * @param {*} withdrawPassword
 */
export async function setWithdrawPassword(withdrawPassword, headers) {
  return post(`${prefix}/v2/user/withdraw-password`, { withdrawPassword }, false, false, headers);
}

/**
 * 更新提现密码
 * @param {*} withdrawPassword
 */
export async function updateWithdrawPassword(withdrawPassword, headers) {
  return post(
    `${prefix}/v2/user/withdraw-password/update`,
    { withdrawPassword },
    false,
    false,
    headers,
  );
}

/**
 * 绑定google 验证
 * @param {*} param0
 */
export async function bindG2AF({ code, isUpdate = false, headers }) {
  const path = isUpdate ? '/v2/user/google2fa/update' : '/v2/user/google2fa';
  return post(`${prefix}${path}`, { code }, false, false, headers);
}

/**
 * 设置邮件安全语
 * @param {*} opts
 */
export async function saveSafewords({
  loginSafeWord, // 登录安全码
  mailSafeWord, // 邮件安全码
  withdrawalSafeWord, // 提币安全码
  headers,
}) {
  return postV2({
    url: `${prefix}/v2/user/safe-words`,
    data: {
      loginSafeWord,
      mailSafeWord,
      withdrawalSafeWord,
    },
    headers,
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
 *@description 用户申请重置交易密码
 * @param backPic 证件照背面
 * @param frontPic 证件照正面
 * @param handPic 手持证件照
 * @return {Promise<*>}
 */
export async function applyResetWithDrawPassword(params) {
  return post(`${prefix}/reset-trade-password/apply`, params);
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
// 获取文章详情
const lang = getCurrentLangFromPath();
const requestLang = ZArticlesLangs[lang] || 'en-us';
export async function getArticlesById(id) {
  return pull(`/zendesk/api/v2/help_center/${requestLang}/articles/${id}.json`);
}

// 注销概览查询接口
export async function getCancellationOverview() {
  return pull('/user-biz-front/v2/user-overview/cancellation');
}
// 同意放弃资产协议
export async function relinquishAssetsAagrement() {
  return post('/user-biz-front/user/assets/give-up');
}
// 解绑手机
export async function unbindPhone({ headers }) {
  return post(`${prefix}/v2/user/phone/unbind`, {}, false, true, headers);
}
// 解绑邮箱
export async function unbindEmail({ headers }) {
  return post(`${prefix}/v2/user/email/unbind`, {}, false, true, headers);
}

/**
 * 获取智能客服服务开关
 */
export function getConfig() {
  return pull(`${prefix}/query/config`);
}

/** 安全中心的发送验证码接口 */
export async function sendValidationCode({ bizType, address, sendChannel }) {
  return post('/risk-validation-center/v1/security/validation/send-validation-code', {
    bizType,
    address,
    sendChannel,
  });
}

/** 安全中心 - 拉取实时安全分 */
export function pullSecurityScore(params) {
  return post('/risk-validation-center/v1/security/center/score', params, false, true);
}

/** 安全中心 - 拉取缓存安全分 */
export function pullCacheSecurityScore() {
  return post('/risk-validation-center/v1/security/center/cache-score');
}
