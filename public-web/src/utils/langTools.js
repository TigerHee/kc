/**
 * Owner: willen@kupotech.com
 */
const RTLLangs = ['ar_AE', 'ur_PK'];

/**
 * 是否是RTL语种
 * @param {String} lang 语种
 * @returns Boolean
 */
export const isRTLLanguage = (lang) => RTLLangs.includes(lang);
