/**
 * Owner: willen@kupotech.com
 */
/**
 * 获得页面 URL 地址，埋点使用
 */
const getFullURL = (pathname) => {
  // const { origin, pathname } = window.location;
  if (pathname) {
    return `${window.location.origin}${pathname}`;
  }
  return window.location.href;
};

export default getFullURL;
