/**
 * Owner: terry@kupotech.com
 */
import pathToRegexp from 'path-to-regexp';
import debounce from 'lodash/debounce';
import { kcsensorsManualTrack } from '@utils/sensors';
import { lngPathMaps } from '@tools/i18n';

export const getRequestDebounce = (delay = 200, options = {}) => {
  const handler = debounce(
    (callback) => {
      if (typeof callback === 'function') callback();
    },
    delay,
    { leading: true, trailing: false, ...options },
  );

  return (func) => {
    handler(func);
  };
};

export const track = ({
  type = 'technology_event',
  data = {},
  elementId = '',
  locationId = '1',
} = {}) => {
  kcsensorsManualTrack({ spm: [elementId, locationId], data }, type);
};

export const checkHomePage = (pathname) => {
  return lngPathMaps.some((item) => {
    const langPath = item?.[1];
    const langPathFull = `/${langPath === window._DEFAULT_LOCALE_ ? '' : langPath}`;
    return langPathFull === pathname;
  });
};

// 移除pathname中的语言子路径，例如 /zh-hant/price  ->  /price
const removeLangPath = (pathname) => {
  const langPrefixItem = lngPathMaps.find((path) => pathname.startsWith(`/${path[1]}/`));
  return langPrefixItem ? pathname.replace(`/${langPrefixItem[1]}`, '') : pathname;
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
