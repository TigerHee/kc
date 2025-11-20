/**
 * Owner: iron@kupotech.com
 */
import pathToRegexp from 'path-to-regexp';
import { isDeepArray, getKCLanguagePaths } from './utils';
import { getSavedSpm } from './spmStorage';

let siteId = '';

let pageIdMap = {};

const logSpmWarn = () =>
  console.warn(
    '[kc sensors]: invalid spm argument, please pass spm argument like [blockId(String), eleId(String)] or [pageId(String), [blockId(String), eleId(String)]]',
  );

const validateBaseSpms = (spms, log = false) => {
  if (Array.isArray(spms) && spms.length === 2 && spms.every((o) => typeof o === 'string')) {
    return true;
  }
  if (log) logSpmWarn();
  return false;
};

export const validateSpm = (spms) => {
  if (Array.isArray(spms)) {
    // 判断是否为二维数组
    if (isDeepArray(spms)) {
      // 解构二维数组配置
      const [pageId, baseSpms] = spms;
      if (typeof pageId === 'string' && validateBaseSpms(baseSpms)) {
        return true;
      }
      logSpmWarn();
      return false;
    }
    return validateBaseSpms(spms, true);
  }
  logSpmWarn();
  return false;
};

export const setSiteId = (id) => {
  siteId = id;
};
export const getSiteId = () => siteId;

export const setPageIdMap = (idMap) => {
  pageIdMap = idMap;
};
export const getPageId = (_pathname) => {
  const routes = Object.keys(pageIdMap);
  // 查找当前 pathname 对应的路由
  let pathname = _pathname || window.location.pathname;
  // 取一级路由
  const [, firstPath] = pathname.split('/');
  const localePrefix = getKCLanguagePaths().find((lng) => lng === firstPath);

  if (localePrefix) {
    const regexp = new RegExp(`^/${localePrefix}/?`);
    pathname = pathname.replace(regexp, '/');
  }

  pathname = pathname === '/' ? pathname : pathname.replace(/\/$/, '');
  const currentRoute = routes.find((route) => {
    return pathToRegexp(route).test(pathname);
  });

  return currentRoute ? pageIdMap[currentRoute] : '';
};

export const getPreSpmCode = () => {
  return getSavedSpm(window.location.href);
};

export const compose = (spms) => {
  if (isDeepArray(spms)) {
    const [pageId, baseSpms] = spms;
    return `${siteId}.${getPageId() || pageId}.${baseSpms.join('.')}`;
  }
  return `${siteId}.${getPageId()}.${spms.join('.')}`;
};

export const wrapPv = (func) => {
  return ({ event }) => {
    if (event === '$pageview') {
      return func();
    }

    return undefined;
  };
};
