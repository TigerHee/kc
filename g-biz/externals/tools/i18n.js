/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';
import i18n from 'i18next';
import {
  initReactI18next,
  I18nextProvider,
  useSSR,
  useTranslation as i18nTranslation,
  Trans as I18nTrans,
} from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { NEED_I18N_STORE } from './i18nStoreSSGConfig';

export const lngPathMaps = (window.__KC_LANGUAGES__?.__ALL__ || []).map((lng) => {
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

  const foundLngMap = lngPathMaps.find((lngMap) => lngMap[1] === lng);

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
    fallbackNs: false,
    keySeparator: false,
    react: {
      useSuspense: false,
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['span'],
    },
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath(lng, ns) {
        if (ns[0] !== 'translation') {
          if (ns[0] === 'userRestricted') {
            // userRestriced namespace 和目录不一致，特殊处理一下
            return `${__public_path__}${__version__}/locales/userRestrictedCommon/${lng}.json`;
          }
          return `${__public_path__}${__version__}/locales/${ns}/${lng}.json`;
        }

        return null;
      },
    },
    returnEmptyString: false,
    parseMissingKeyHandler: (key, defaultValue) => {
      // const sentryNamespace = window.SENTRY_NAMESPACE || 'SentryLazy';
      // try {
      //   if (window[sentryNamespace]) {
      //     window[sentryNamespace]?.captureEvent({
      //       message: `gbiz - i18n key missing: ${key}`,
      //       level: 'error',
      //       tags: {
      //         errorType: 'i18n_missing_key',
      //       },
      //       fingerprint: key,
      //     });
      //   }
      // } catch (e) {
      //   console.log(e);
      // }
      return defaultValue;
    },
  });

const namespaces = [
  'header',
  'footer',
  'entrance',
  'userRestricted',
  'downloadBanner',
  'captcha',
  'common-base',
  'kyc',
  'notice-center',
  'security',
  'share',
  'convert',
  'verification',
  'trade',
];

const LocaleProvider = (props) => {
  const { children } = props;
  useSSR(window.initialI18nStore, window.initialLanguage);

  const { ready } = i18nTranslation(namespaces);

  useEffect(() => {
    if (navigator.userAgent.indexOf('SSG_ENV') !== -1 && ready && !window.initialI18nStore) {
      let i18StoreData = null;

      // TIPS: 这里加个判断，只保留必要的 store lang
      if (props.name && NEED_I18N_STORE[props.name]) {
        const needLangMap = {};
        const langItem = i18n.store.data[i18n.language];
        NEED_I18N_STORE[props.name].forEach((item) => {
          needLangMap[item] = langItem[item];
        });
        i18StoreData = {
          [i18n.language]: needLangMap,
        };
      }

      const initialI18nScript = document.createElement('script');
      initialI18nScript.text = `
        window.initialI18nStore = ${JSON.stringify(i18StoreData || i18n.store.data)};
        window.initialLanguage = '${i18n.language}';
      `;

      document.head.appendChild(initialI18nScript);
    }
  }, [props.name, ready]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export const useTranslation = (ns, options) => {
  const { t: _it, ...props } = i18nTranslation(ns, options);
  return {
    ...props,
    t: (key, variables) =>
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
