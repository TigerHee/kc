/**
 * Owner: willen@kupotech.com
 */
import { pull, postJson } from 'gbiz-next/request';

const prefix = '/ucenter';


/**
 * 重置密码
 * @param {*} type reset-password-email/reset-password-mobilel
 */
export async function resetPwd(type) {
  return pull(`${prefix}/${type}`);
}



/**
 * 获取用户信息
 * @returns {Promise<void>}
 */
export async function getUserInfo() {
  return pull(`${prefix}/user-info`);
}

export async function getLoginSMSValidationCode(token) {
  return pull(`${prefix}/send-login-sms`, { token });
}


/**
 * 获取邀请者信息
 * @param {*} referrerCode
 */
export async function getRefer(referrerCode) {
  return pull(`${prefix}/user/referrer-info`, { referrerCode });
}
