/**
 * Owner: odan.ou@kupotech.com
 */

import addLangToPath from '@tools/addLangToPath';

const siteConfig = window._WEB_RELATION_ || {};

const composeUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${siteConfig.KUCOIN_HOST || window.location.origin}${url}`;
};

export const jumpPage = (url, currentLang) => {
  const newWindow = window.open(addLangToPath(composeUrl(url), currentLang));
  if (newWindow) newWindow.opener = null;
};
