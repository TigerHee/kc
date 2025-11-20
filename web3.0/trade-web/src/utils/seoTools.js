/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-02-27 13:03:24
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-07-22 10:40:45
 * @FilePath: /trade-web/src/utils/seoTools.js
 * @Description: 添加语言路径
 */
import { determineBasenameFromUrl, getPathByLang, addLangToPath } from './lang';

const localBase = determineBasenameFromUrl();
export function changeLangPath(lang) {
  const langPath = getPathByLang(lang);
  const { origin } = window.location;
  const href = `${window.location.origin}${window.location.pathname}`;
  let alternated = `${origin}/${localBase || ''}`;
  if (localBase && href.indexOf(`${origin}/${localBase}/`) !== -1) {
    alternated = `${origin}/${localBase}/`;
  }
  let url = href.replace(alternated, `${origin}/${langPath === window._DEFAULT_LOCALE_ ? '' : `${langPath}/`}`);
  if (url.endsWith('/')) {
    url = url.substring(0, url.length - 1);
  }
  return url;
}

export function addLangPathToUrl(url, lang) {
  const langPath = getPathByLang(lang);
  if (langPath === window._DEFAULT_LOCALE_) {
    return url;
  }
  return url.replace(window.location.origin, `${window.location.origin}/${langPath}`);
}
