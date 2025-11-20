/**
 * Owner: melon@kupotech.com
 */
import { post, get } from '@tools/request';

const prefix = '/ucenter';

/**
 * 校验极验
 *
 * @returns {Object}
 */
export async function captchaValidate(data) {
  return post(
    `${prefix}/captcha/validate`,
    {
      ...data,
    },
    true,
  );
}

/**
 * 初始化极验
 * params 携带值
 * bizType 验证的业务 可选值 PHONE_LOGIN, EMAIL_LOGIN, EMAIL_REGISTER, PHONE_REGISTER, CREATE_API, SPOTLIGHT_ORDER, FORGOT_PASSWORD, BIND_PHONE, REBINDING_PHONE
 * versionNo 版本号
 * @returns {Object}
 */
export async function captchaInit(params) {
  return get(`${prefix}/captcha/init`, params);
}

/**
 * 获取图片验证base64
 */
export function getImageVer(params) {
  return get(`${prefix}/captcha/image.png`, params);
}
