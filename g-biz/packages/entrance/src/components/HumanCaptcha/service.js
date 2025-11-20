/**
 * Owner: iron@kupotech.com
 */
import { get, post } from '@tools/request';

// 初始化人机验证
export function captchaInit(param) {
  return get('/ucenter/captcha/init', param);
}

// 校验人机验证结果
export function captchaVerify(param) {
  return post('/ucenter/captcha/validate', param, true);
}

// 获取图片验证base64
export function getImageVer(params) {
  return get('/ucenter/captcha/image.png', params);
}
