/**
 * Owner: iron@kupotech.com
 */
import { get, post } from '@tools/request';

/**
 * @description 检验需要检验的类型
 */
export const getRequiredValidations = (params) => {
  return get('/ucenter/check-required-validations', { ...params, seq: 1 });
};

/**
 * @description 获取验证码
 * @param {*} type register-email/register-short-message
 */
export async function sendValidationCode(data) {
  return post(`/ucenter/send-validation-code`, data, true);
}

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
