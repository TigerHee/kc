/**
 * Owner: willen@kupotech.com
 */
import { post, pull } from 'tools/request';

const prefix = '/ucenter';
/**
 * 获取验证码(根据后端要求，register-email 用post)
 * @param {*} type register-email/register-short-message
 */
export async function getRegisterVcode(type, data) {
  if (type === 'register-email') {
    return post(`${prefix}/${type}`, data);
  }
  return pull(`${prefix}/${type}`, data);
}

/**
 * 重置密码
 * @param {*} type reset-password-email/reset-password-mobilel
 */
export async function resetPwd(type) {
  return pull(`${prefix}/${type}`);
}

/**
 * 注册
 * @param {*} type sign-up-email/ sign-up-mobile
 */
export async function signUp(type, data) {
  return post(`${prefix}/${type}`, data);
}

/**
 * 验证验证码
 * @param {*} data
 */
export async function validateCode(data) {
  return post(`${prefix}/verify-validation-code`, data);
}

export async function getLoginSMSValidationCode(token) {
  return pull(`${prefix}/send-login-sms`, { token });
}

/**
 * 注册码验证
 * @param {*} address
 * @param {*} code
 */
export async function verifyRegister(address, code, validationType) {
  return post(`${prefix}/sign-up-validation`, { address, code, validationType });
}

/**
 * 获取邀请者信息
 * @param {*} referrerCode
 */
export async function getRefer(referrerCode) {
  return pull(`${prefix}/user/referrer-info`, { referrerCode });
}

/**
 * 获取储备金信息
 */
export const getAssetReserve = () => {
  return pull('/asset-front/proof-of-reserves/asset-reserve');
};
