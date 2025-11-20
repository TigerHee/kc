/**
 * Owner: tiger@kupotech.com
 */

export const SUPPORT_RELOAD_VERSION = '3.89.0';
export const SUPPORT_KCNB_FONT_VERSION = '3.96.0';

const RTLLangs = ['ar_AE', 'ur_PK'];

/**
 * 是否是RTL语种
 * @param {String} lang 语种
 * @returns Boolean
 */
export const isRTLLanguage = lang => RTLLangs.includes(lang);