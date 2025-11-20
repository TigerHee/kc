/**
 * Owner: tiger@kupotech.com
 */
import { IS_DEV } from "kc-next/env";

export const MODEL_NAMESPACE = 'gbiz_common_captcha';

// 校验key 常量
export const geeTestKey = 'geetest';
export const recaptchaKey = 'recaptcha';
export const image = 'image';
export const hCaptchaKey = 'hcaptcha';

export const VALIDATE_MAP = {
  [recaptchaKey]: 'reCAPTCHA',
  [geeTestKey]: 'GEETEST',
  [image]: 'IMAGE',
  [hCaptchaKey]: 'HCAPTCHA',
};

// GoogleCaptcha sitekey
export const reCaptcha_sitekey_prod = GOOGLE_CAPTCHA_SITE_KEY;
export const reCaptcha_sitekey_dev = GOOGLE_CAPTCHA_DEV_SITE_KEY;

export const getReCaptchaSitekey = () => {
  if (IS_DEV) {
    return reCaptcha_sitekey_dev;
  }
  return reCaptcha_sitekey_prod;
};
