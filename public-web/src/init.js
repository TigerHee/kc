/**
 * Owner: willen@kupotech.com
 */
import { addLangToPath, LANG_DOMAIN, WITHOOU_LANG_PATH } from 'tools/i18n';
import { initQueryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import 'requestidlecallback';
import 'tools/bindRemoteEvents';
import 'tools/sentry';

window.LANG_DOMAIN = LANG_DOMAIN;
window.WITHOOU_LANG_PATH = WITHOOU_LANG_PATH;

// window.open()链接带上url参数
const windowOpen = window.open;
window.open = (url = '', ...rest) => {
  if (!url) {
    return windowOpen(url, ...rest);
  }
  const urlWithLang = addLangToPath(url);
  return windowOpen(urlWithLang, ...rest);
};

// saveQueryParam2SessionStorage
initQueryPersistence();
