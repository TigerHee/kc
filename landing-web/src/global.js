/**
 * Owner: jesse.shao@kupotech.com
 */

import { addLangToPath } from 'utils/lang';
import sentryInit from 'utils/sentry';
import { IS_TEST_ENV, IS_PROD } from 'utils/env';
import { LANG_DOMAIN } from 'config';
import { initQueryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import storage from 'utils/storage';

window.LANG_DOMAIN = LANG_DOMAIN;

// window.open()链接带上url参数
const windowOpen = window.open;

window.originOpen = windowOpen;

window.open = (url = '', ...rest) => {
  if (!url) {
    return windowOpen(url, ...rest);
  }
  const urlWithLang = addLangToPath(url);
  return windowOpen(urlWithLang, ...rest);
};

// 语言地区合规
const nextUrl = new URL(location);
let ipRestrictLang = nextUrl.searchParams.get('x');
if (ipRestrictLang) {
  if (ipRestrictLang === 'l') {
    ipRestrictLang = 'fr_FR';
  }
  window.ipRestrictCountry = ipRestrictLang;
  nextUrl.searchParams.delete('x');
  if (storage.getItem('lang') === ipRestrictLang) {
    storage.setItem('lang', 'en_US');
  }
  if (nextUrl.searchParams.get('lang') === ipRestrictLang) {
    nextUrl.searchParams.delete('lang');
  }
  history.replaceState({}, "", nextUrl);
}

window.injectProdInfo = {
  // _SITE_: _SITE_,
  _DEV_: _DEV_,
  IS_TEST_ENV: IS_TEST_ENV,
  NOT_PROD: !IS_PROD,
};

sentryInit();
// saveQueryParam2SessionStorage
initQueryPersistence();
