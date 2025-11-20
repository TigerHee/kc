/**
 * Owner: Hanx.Wei@kupotech.com
 */
const CMS_COMMON_STATE = {};
window.getCmsCommonState = () => CMS_COMMON_STATE;
export const exposeCmsHtmlForSSG = (key, html) => {
  CMS_COMMON_STATE[key] = html;
};
