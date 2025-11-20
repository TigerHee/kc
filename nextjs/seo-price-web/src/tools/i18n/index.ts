import urlparser from "urlparser";
import formatUrlWithLangQuery from "../formatUrlWithLang";
import { getCurrentLocale, getDefaultLocale } from "kc-next/i18n";
import { bootConfig } from "kc-next/boot";

// 不需要语言子路径的链接
export const WITHOOU_LANG_PATH = ["/rss/news", "/cert"];
const withOutLangPath = WITHOOU_LANG_PATH.map((item) => item.substring(1));

// 增加语言子路径
export const addLangToPath = (url = "") => {
  if (!url) {
    return url;
  }
  const hasLangPathDomain = bootConfig._LANG_DOMAIN_;
  if (url.startsWith("http") || url.startsWith("/")) {
    const location = urlparser.parse(url);
    if (location?.host?.hostname) {
      const accord = hasLangPathDomain.some((item) =>
        location.host.hostname.startsWith(item)
      );
      const isInnet = location.host.hostname.endsWith("kucoin.net");
      const isLocalDev = location.host.hostname.includes("localhost");
      // 外链
      if (!accord && !isInnet && !isLocalDev) {
        return url;
      }
    }
    if (location?.path?.base) {
      const withOutLang = withOutLangPath.some((item) => {
        return location.path.base === item;
      });
      // 内链，不需要语言子路径
      if (withOutLang) {
        return location?.query?.params?.lang ? url : formatUrlWithLangQuery(url);
      }
    }
    const locale = getCurrentLocale();
    const defaultLocale = getDefaultLocale();
    const localeBasename = locale !== defaultLocale ? locale : "";
    if (localeBasename && location) {
      if (location.path) {
        const homePage = location.path?.base === localeBasename;
        if (location.path?.base?.startsWith(`${localeBasename}/`) || homePage) {
          return url;
        }
        location.path.base = `${localeBasename}/${location.path.base}`;
      } else {
        location.path = { base: localeBasename };
      }
    }
    if (!localeBasename) {
      return url;
    }
    return location.toString();
  }
  return url;
};
