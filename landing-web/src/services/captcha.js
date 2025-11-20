/**
 * Owner: jesse.shao@kupotech.com
 */
import { post, pull } from 'utils/request';

const prefix = '/ucenter';

/**
 * 校验极验
 *
 * @returns {Object}
 */
export async function captchaValidate(data) {
  return post(`${prefix}/captcha/validate`, {
    ...data,
  });
}

/**
 * 初始化极验
 *
 * @returns {Object}
 */
export async function captchaInit(bizType = {}) {
  return pull(`${prefix}/captcha/init`, {
    bizType,
  });
}

/**
 * 获取图片验证base64
 */
export function getImageVer(params) {
  return pull(`${prefix}/captcha/image.png`, params);
}
