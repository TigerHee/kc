/**
 * Owner: odan.ou@kupotech.com
 */

import addLangToPath from 'tools/addLangToPath';
import JsBridge from 'tools/jsBridge';
import pathToRegexp from 'path-to-regexp';
import { _DEV_ } from 'tools/env';

const composeUrl = (url: string) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${window.location.origin}${url}`;
};

export const jumpPage = (url: string, isInApp: boolean) => {
  const targetUrl = composeUrl(addLangToPath(url));
  if (isInApp) {
    JsBridge.open({
      type: 'jump',
      params: {
        url: `/link?url=${encodeURIComponent(targetUrl)}`,
      },
    });
  } else {
    const newWindow = window.open(targetUrl);
    if (newWindow) newWindow.opener = null;
  }
};

export const doesUrlMatch = (url: string, currentLocation: { href: string; pathname: string; origin: string }) => {
  const { href: currentHref, pathname: currentPathname, origin: currentOrigin } = currentLocation;
  const hrefWithLang = addLangToPath(url);
  let patternPath = '';
  let candidateHref = '';
  try {
    // 使用 base 解析，兼容相对路径与含有 :param 的模式
    const candidate = new URL(hrefWithLang, currentOrigin);
    patternPath = candidate.pathname;
    candidateHref = candidate.href;
    // 使用 path-to-regexp 对 pathname 做模式匹配（支持 /a/b/:test 等）
    const re = pathToRegexp(patternPath);
    if (re.test(currentPathname)) return true;
    // 兜底：保持与旧逻辑一致的完整 href 精确匹配
    return candidateHref === currentHref;
  } catch (err) {
    if (_DEV_) {
      console.warn('SupportBot parsing url error:', url, err);
    }
    return false;
  }
};
