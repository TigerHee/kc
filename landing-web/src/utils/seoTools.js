/**
 * Owner: jesse.shao@kupotech.com
 */
import { getLocalBase, getPathByLang } from 'utils/langTools';

const { localeBasenameFromPath: localBase } = getLocalBase();
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
