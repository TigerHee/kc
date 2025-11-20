/**
 * Owner: iron@kupotech.com
 */
import { useEffect } from 'react';
import i18n from 'i18next';
import {
  initReactI18next,
  I18nextProvider,
  useSSR,
  useTranslation as i18nTranslation,
  Trans as I18nTrans,
} from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { langToLocale } from '../../adaptor/kc-next/i18n';
import { IS_DEV } from 'kc-next/env';

export const lngPathMaps = (window.__KC_LANGUAGES__?.__ALL__ || []).map(lng => {
  const value = window.__KC_LANGUAGES_BASE_MAP__.langToBase[lng] || window._DEFAULT_LOCALE_;

  return [lng, value];
});

export function lookupPath() {
  let lng;
  const language = window.location.pathname.match(/\/([a-zA-Z-]*)/g);
  if (language instanceof Array) {
    if (typeof language[0] !== 'string') {
      lng = window._DEFAULT_LOCALE_;
    }
    lng = language[0].replace('/', '');
  }

  const foundLngMap = lngPathMaps.find(lngMap => lngMap[1] === lng);

  if (foundLngMap) {
    return foundLngMap[0];
  }

  return window._DEFAULT_LANG_;
}

const initialLng = lookupPath();

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: initialLng,
    fallbackLng: false,
    keySeparator: false,
    nonExplicitSupportedLngs: true,
    load: 'currentOnly',
    react: {
      useSuspense: false,
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['span'],
    },
    interpolation: {
      escapeValue: false,
      prefix: '{',
      suffix: '}',
    },
    backend: {
      loadPath(lng, ns) {
        const defaultAssetPath = 'https://assets.staticimg.com/gbiz-next';
        const assetsPath = IS_DEV ? 'http://localhost:5002' : defaultAssetPath;
        if (ns[0] !== 'translation') {
          return IS_PROXY_DEV ? `http://localhost:5002/${__version__}/locales/${lng}/${ns[0]}.json`: `https://assets.staticimg.com/gbiz-next/${__version__}/locales/${lng}/${ns[0]}.json`;
        }
        return null;
      },
    },
    returnEmptyString: false,
    parseMissingKeyHandler: (key, defaultValue) => {
      return defaultValue;
    },
  });

// 新增的在此添加
const namespaces = [
  'header',
  'kyc',
  'trade',
  'entrance',
  'transfer'
];

const LocaleProvider = props => {
  const { children } = props;
  useSSR(window.initialGbizNextI18nStore, window.initialGbizNextLanguage);

  const { ready } = i18nTranslation(namespaces);


  useEffect(() => {
    if (navigator.userAgent.indexOf('SSG_ENV') !== -1 && ready && !window.initialGbizNextI18nStore) {
      const initialI18nScript = document.createElement('script');
      initialI18nScript.text = `
        window.initialGbizNextI18nStore = ${JSON.stringify(i18n.store.data)};
        window.initialGbizNextLanguage = '${i18n.language}';
      `;

      document.head.appendChild(initialI18nScript);
    }
  }, [ready]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export const useTranslation = (ns, options) => {
  const { t: _it, ...props } = i18nTranslation(ns, options);
  return {
    ...props,
    t: (key, variables) =>
      // @ts-ignore
      _it(key, {
        brandName: window._BRAND_NAME_,
        siteBaseCurrency: window._BASE_CURRENCY_ || 'USDT',
        ...variables,
      }),
  };
};

export const Trans = ({ children, ...props }) => {
  return (
    <I18nTrans
      {...props}
      values={{
        brandName: window._BRAND_NAME_,
        siteBaseCurrency: window._BASE_CURRENCY_ || 'USDT',
        ...props.values,
      }}
    >
      {children}
    </I18nTrans>
  );
};

export { LocaleProvider };
export default i18n;
