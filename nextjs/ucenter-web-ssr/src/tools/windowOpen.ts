import { sentryReport } from '@/core/telemetryModule';
import { addLangToPath } from '@/tools/i18n';
import { IS_CLIENT_ENV } from 'kc-next/env';

export const init = () => {
  if (!IS_CLIENT_ENV) {
    return;
  }
  // window.open()链接带上url参数
  const windowOpen = window.open;
  try {
    /**
     * 告警排查，检查 window.open 是否被劫持，是则上报
     * @url https://insight.kcprd.com/alert/detail?_id=e0bb1984ab73463aba31d85a5835273f
     */
    const openDescriptor = Object.getOwnPropertyDescriptor(window, 'open');
    if (openDescriptor?.writable) {
      window.open = (url: string | URL = '', ...rest) => {
        if (!url) {
          return windowOpen(url, ...rest);
        }
        const urlWithLang = addLangToPath(typeof url === 'string' ? url : url.toString());
        return windowOpen(urlWithLang, ...rest);
      };
    } else if (openDescriptor?.set !== undefined) {
      sentryReport({
        level: 'warning',
        message: `window.open is hijacked. ${openDescriptor.set.toString()}`,
        tags: {
          errorType: 'hijacked',
        },
        fingerprint: ['window_open_is_hijacked'],
      });
    }
  } catch (error) {
    console.error(error);
  }
};
