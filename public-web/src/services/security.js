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
 * @description 查询用户设置了哪些安全保护措施以及是否进行过KYC
 * @return {Promise<*>}
 */
export async function getSeMethod() {
  return pull(`${prefix}/user/security-methods`);
}

/**
 * @description 检验需要验证的类型
 * @param bizType
 * @return {Promise<*>}
 */
export async function checkValidations(params) {
  return originPull(`${prefix}/check-required-validations`, { ...params, seq: 1 });
}
