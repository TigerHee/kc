/**
 * Owner: willen@kupotech.com
 */
import { post, pull } from 'tools/request';

const prefix = '/ucenter';
/**
 * 获取验证码
 * @param {*} type register-email/register-short-message
 */
export async function verify(data) {
  return post(`${prefix}/verify-validation-code`, data);
}

export async function getValidationCode({ sendChannel, bizType, address }) {
  return post(`${prefix}/send-validation-code`, {
    bizType,
    sendChannel,
    address,
  });
}

/**
 * 获取该业务支持的检验方式
 * @param {*} bizType
 */
export async function getValidations(bizType) {
  return pull(`${prefix}/check-required-validations`, {
    bizType,
  });
}
