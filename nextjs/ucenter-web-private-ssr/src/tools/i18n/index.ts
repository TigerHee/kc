import urlParser from 'urlparser';
import formatUrlWithLangQuery from '../formatUrlWithLang';
import { getCurrentLocale, getDefaultLocale, getCurrentLang } from 'kc-next/i18n';
import { bootConfig } from 'kc-next/boot';
import { TLocationQuery } from '@/types/TLocationQuery.ts';
import { i18n } from 'next-i18next';
import { Parser } from 'html-to-react';
import i18next from './client';
import { IS_SSR_MODE } from 'kc-next/env';

export { getAllLocaleMap } from 'kc-next/i18n';

const htmlToReactParser = new Parser();

// 不需要语言子路径的链接
export const WITH_OUT_LANG_PATH: string[] = [];
const withOutLangPath = WITH_OUT_LANG_PATH.map((item) => item.substring(1));

// 增加语言子路径
export const addLangToPath = (url = '') => {
  if (!url) {
    return url;
  }
  const hasLangPathDomain = bootConfig._LANG_DOMAIN_;
  if (url.startsWith('http') || url.startsWith('/')) {
    const location = urlParser.parse(url);
    const query = location.query as TLocationQuery;

    if (location?.host?.hostname) {
      const accord = hasLangPathDomain.some((item) => location.host.hostname.startsWith(item));
      const isInner = location.host.hostname.endsWith('kucoin.net');
      const isLocalDev = location.host.hostname.includes('localhost');
      // 外链
      if (!accord && !isInner && !isLocalDev) {
        return url;
      }
    }
    if (location?.path?.base) {
      const withOutLang = withOutLangPath.some((item) => {
        return location.path.base === item;
      });
      // 内链，不需要语言子路径
      if (withOutLang) {
        return query?.params?.lang ? url : formatUrlWithLangQuery(url);
      }
    }
    const locale = getCurrentLocale();
    const defaultLocale = getDefaultLocale();
    const localeBasename = locale !== defaultLocale ? locale : '';
    if (localeBasename && location) {
      if (location.path) {
        const homePage = location.path?.base === localeBasename;
        if (location.path?.base?.startsWith(`${localeBasename}/`) || homePage) {
          return url;
        }
        location.path.base = `${localeBasename}/${location.path.base}`;
      } else {
        location.path = { base: localeBasename } as any;
      }
    }
    if (!localeBasename) {
      return url;
    }
    return location.toString();
  }
  return url;
};

// 默认参数
const DEFAULT_PARAMS = () => ({
  brandName: bootConfig._BRAND_NAME_,
  siteBaseCurrency: bootConfig._BASE_CURRENCY_,
});

export const _t = (key: string, values?: Record<string, any>, ns: string = 'common') => {
  const i18nInstance = IS_SSR_MODE ? i18n : i18next;
  if (!i18nInstance) {
    console.warn('[i18n] i18n instance not initialized yet');
    return key;
  }

  const mergedValues = {
    ...DEFAULT_PARAMS(),
    ...values,
  };

  return i18nInstance.t(key, { ns, ...mergedValues });
};

export const _tHTML = (key: string, values?: Record<string, any>, ns: string = 'common') => {
  const i18nInstance = IS_SSR_MODE ? i18n : i18next;
  if (!i18nInstance) {
    console.warn('[i18n] i18n instance not initialized yet');
    return key;
  }

  const mergedValues = {
    ...DEFAULT_PARAMS(),
    ...values,
  };

  const translation = i18nInstance.t(key, { ns, ...mergedValues });

  return htmlToReactParser.parse(translation);
};

export const getCurrentLangFromPath = () => {
  const currentLang = getCurrentLang();
  return currentLang;
};
