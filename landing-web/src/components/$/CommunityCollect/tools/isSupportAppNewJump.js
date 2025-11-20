/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { compareVersion } from 'helper';

// @TODO: 全局的配置
export const APP_SUPPORT_VERSION = '3.97.0';

/**
 * 是否支持 app updateHeader 新的特性等判断
 * @returns {boolean}
 */
export function isSupportAppNewJump(appVersion) {
  return compareVersion(appVersion, APP_SUPPORT_VERSION) >= 0;
}
