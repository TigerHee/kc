/**
 * Owner: willen@kupotech.com
 */

import { IS_CLIENT } from "@/config/env";

/**
 * 获得页面 URL 地址，埋点使用
 */
const getFullURL = (pathname) => {
  if (!IS_CLIENT) return '';
  // const { origin, pathname } = window.location;
  if (pathname) {
    return `${window.location.origin}${pathname}`;
  }
  return window.location.href;
};

export default getFullURL;
