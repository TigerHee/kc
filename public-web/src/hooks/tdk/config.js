/**
 * Owner: ella.wang@kupotech.com
 */

// price/coin 获取tdk模板 其余price/xx自路由获取后台配置的tdk
const isPriceTemplate = (location) => {
  const { pathname } = location;
  if (/^\/price/.test(pathname)) {
    if (/^\/price(\/(hot-list|top-gainers|new-coins))?$/.test(pathname)) {
      return false;
    }
    return true;
  }
  return false;
};

// 需要单独处理tdk,不采用tdk系统配置的路由。
export const TDK_EXCLUDE_PATH = [
  /\/announcement(\/.*)*/,
  /\/support\/.+/,
  /\/pre-market\/.+/,
  isPriceTemplate,
];
