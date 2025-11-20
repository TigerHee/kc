/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'gbiz-next/request';

const prefix = '/ucenter';


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
