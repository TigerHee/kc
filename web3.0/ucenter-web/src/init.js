/**
 * Owner: willen@kupotech.com
 */
import { initQueryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { initReport } from '@kucoin-gbiz-next/report';
import 'requestidlecallback';
import 'tools/bindRemoteEvents';
import { addLangToPath, WITHOOU_LANG_PATH } from 'tools/i18n';
import 'tools/sentry';
import { sentryReport } from 'tools/sentry';

window.WITHOOU_LANG_PATH = WITHOOU_LANG_PATH;

// window.open()链接带上url参数
const windowOpen = window.open;
try {
  /**
   * 告警排查，检查 window.open 是否被劫持，是则上报
   * @url https://insight.kcprd.com/alert/detail?_id=e0bb1984ab73463aba31d85a5835273f
   */
  const openDescriptor = Object.getOwnPropertyDescriptor(window, 'open');
  if (openDescriptor?.writable) {
    window.open = (url = '', ...rest) => {
      if (!url) {
        return windowOpen(url, ...rest);
      }
      const urlWithLang = addLangToPath(url);
      return windowOpen(urlWithLang, ...rest);
    };
  } else if (openDescriptor?.set !== undefined) {
    sentryReport({
      level: 'warning',
      message: `window.open is hijacked. ${openDescriptor.set.toString()}`,
      tags: {
        errorType: 'hijacked',
      },
      fingerprint: 'window_open_is_hijacked',
    });
  }
} catch (error) {
  console.error(error);
}

// saveQueryParam2SessionStorage
initQueryPersistence();

initReport(_APP_NAME_, { useSm: true });
