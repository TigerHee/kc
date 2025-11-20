/**
 * Owner: terry@kupotech.com
 */
import pathToRegexp from "path-to-regexp";
import debounce from "lodash-es/debounce";
import { kcsensorsManualTrack } from "tools/sensors";
import { bootConfig } from 'kc-next/boot';

export const getRequestDebounce = (delay = 200, options = {}) => {
  const handler = debounce(
    (callback) => {
      if (typeof callback === "function") callback();
    },
    delay,
    { leading: true, trailing: false, ...options }
  );

  return (func) => {
    handler(func);
  };
};

export const track = ({
  type = "technology_event",
  data = {},
  elementId = "",
  locationId = "1",
} = {}) => {
  kcsensorsManualTrack({ spm: [elementId, locationId], data }, type);
};

export const checkHomePage = (pathname) => {
  return Object.keys(bootConfig.localesMap).some(basename => {
    return pathname === '/' || pathname === `/${basename}`;
  });
};

// 移除pathname中的语言子路径，例如 /zh-hant/price  ->  /price
const removeLangPath = (pathname) => {
  for (const basename of Object.keys(bootConfig.localesMap)) {
    if (pathname.startsWith(`/${basename}/`)) {
      pathname = pathname.replace(`/${basename}`, '');
      break;
    }
  }
  return pathname;
};

export const checkJump = (pathRegList, pathname) => {
  if (!pathname) return false;
  return !!pathRegList.find((pathReg) => {
    // if (pathReg === '/') {
    //   // 首页单独处理 /, /zh-hant, /ja, /fr等 都需要匹配reg: '/'
    //   return checkHomePage(pathname);
    // }
    const _pathname = removeLangPath(pathname);
    return pathToRegexp(pathReg).test(_pathname);
  });
};

export function hasErrorCode(e: unknown): e is { code: string } {
  return typeof e === "object" && e !== null && "code" in e;
}