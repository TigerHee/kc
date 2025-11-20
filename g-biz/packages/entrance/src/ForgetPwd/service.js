/**
 * Owner: iron@kupotech.com
 */
import { post, get } from '@tools/request';

// 发送验证码
export function sendVerifyCode(param) {
  return post('/ucenter/send-validation-code', param, true);
}

// 校验验证码是否OK
export function verifyCode(param) {
  return post('/ucenter/verify-validation-code', param, true);
}

// 重置邮箱密码
export function resetEmailPwdV2(param) {
  return post('/ucenter/v2/reset-password-email', param, true);
}

// 重置邮箱密码V3
export function resetEmailPwd(param) {
  return post('/ucenter/v3/reset-password-email', param, true);
}

// 重置手机密码
export function resetPhonePwdV2(param) {
  return post('/ucenter/v2/reset-password-phone', param, true);
}

// 重置手机密码V3
export function resetPhonePwd(param) {
  return post('/ucenter/v3/reset-password-phone', param, true);
}

// 获取区号列表
export function getCountryCodes() {
  return get('ucenter/country-codes');
}

// 重新发送授权邮件
export function resetMailVerifyEmail(param) {
  return post('/ucenter/ucenter-email/resend', param, true);
}

// 忘记密码风控校验
export function riskCheck(param) {
  return post('/ucenter/ucenter-email/risk-check', param, true);
}

// 获取忘记密码邮件授权结果
export function getMailVerifyResult(params) {
  return get('ucenter/ucenter-email/query', params);
}

/**
 * @description 检验需要检验的类型
 */
export const getRequiredValidations = (params) => {
  return get('/ucenter/check-required-validations', { ...params, seq: 1 });
};

/**
 * @description 检验
 */
export const verifyValidations = ({ validations, ...other }) => {
  let opts = {};
  if (validations) {
    opts = Object.keys(validations).reduce((sum, cur) => {
      return { ...sum, [`validations[${cur.toUpperCase()}]`]: validations[cur] };
    }, {});
  }
  return post('/ucenter/verify-validation-code', { se1: 1, ...other, ...opts }, true);
};
