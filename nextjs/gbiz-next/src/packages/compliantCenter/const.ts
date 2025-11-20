/**
 * Owner: terry@kupotech.com
 */

export const NAMESPACE = "$compliant_center";
export const FORBIDDEN_PREFIX = ["/restrict", "/forbidden", "/error", "/404"];
export const FORBIDDEN_URL = "/restrict?code=PAGE_COMPLIANCE";
// 判断SSG环境
export const isSSG = navigator.userAgent.indexOf("SSG_ENV") > -1;

// 站点切换的 code
export const SITE_NOT_MATCH_CODE = "308100";
