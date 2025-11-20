/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useRef } from 'react';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';

export { Trans } from 'react-i18next';

export const makeTranslation = (ns) => {
  return () => useTranslation(ns);
};

const LocaleProvider = (props) => {
  const { locale, ns = 'translation', children } = props;
  const i18nRef = useRef(null);

  if (!i18nRef.current) {
    i18nRef.current = i18n.createInstance();
    i18nRef.current.use(initReactI18next).init({
      fallbackLng: 'en_US',
      keySeparator: false,
      react: {
        useSuspense: false,
      },
      interpolation: {
        escapeValue: false,
      },
    });
  }

  useEffect(() => {
    const lng = locale.locale;
    if (!lng) {
      throw new Error('Missing locale key in lng resource!');
    }
    if (!i18nRef.current.hasResourceBundle(lng, ns)) {
      i18nRef.current.addResourceBundle(lng, ns, locale, true, true);
    }
    i18nRef.current.changeLanguage(locale.locale);
  }, [locale]);

  return <I18nextProvider i18n={i18nRef.current}>{children}</I18nextProvider>;
};

export default LocaleProvider;
