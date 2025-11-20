/**
 * Owner: Hanx.Wei@kupotech.com
 */

// 跳转的链接添加语言前缀，eg: /price/BTC => /zh-hant/price/BTC
import { getLocaleBasename } from 'tools/i18n';

const localeBase = getLocaleBasename();

export default function formatUrlPathWithLangPrefix(urlPath, host) {
  const langPrefix = localeBase ? `/${localeBase}` : '';
  if (host) {
    if (!/^https?:\/\//.test(host)) {
      host = `https://${host}`;
    }
    const urlObj = new URL(host);
    const pathWithHost = urlObj.pathname === '/' ? '' : urlObj.pathname;
    return `${urlObj.origin}${langPrefix}${pathWithHost}${urlPath}`;
  }
  return `${langPrefix}${urlPath}`;
}
