/**
 * Owner: brick.fan@kupotech.com
 */

// 检测回调地址是否是受信任
window._CHECK_BACK_URL_IS_SAFE_ = function (url) {
  // url不存在，返回false
  if (!url) return false;
  const _url = decodeURIComponent(decodeURIComponent(url));

  // 如果有`javascript`, 该链接无法确保安全，返回false
  if (/javascript/gi.test(_url)) return false;

  let urlObj = null;
  try {
    urlObj = new URL(_url);
  } catch (e) {
    // url解析失败，返回false
    return false;
  }

  const hostname = window?.location?.hostname;
  const SAFE_WEB_DOMAIN = hostname
    ? [...window._SAFE_WEB_DOMAIN_, hostname]
    : window._SAFE_WEB_DOMAIN_;

  // hostname 是否受信任
  return SAFE_WEB_DOMAIN.some((domain) => urlObj.hostname === domain);
};
