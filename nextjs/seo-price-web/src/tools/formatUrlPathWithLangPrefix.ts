/**
 * Owner: Hanx.Wei@kupotech.com
 */
import { addLangToPath } from "@/tools/i18n";

// 跳转的链接添加语言前缀，eg: /price/BTC => /zh-hant/price/BTC
export default function formatUrlPathWithLangPrefix(urlPath: string, host?: string) {

  if (host) {
    if (!/^https?:\/\//.test(host)) {
      host = `https://${host}`;
    }
    const urlObj = new URL(host);
    const pathWithHost = urlObj.pathname === '/' ? '' : urlObj.pathname;
    const url = addLangToPath(`${urlObj.origin}${pathWithHost}${urlPath}`);
    return url
  }
  const url = addLangToPath(`${urlPath}`);
  return url;
}
