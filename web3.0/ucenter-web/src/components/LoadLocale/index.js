/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import React from 'react';
import { getLangFromLocaleMap, getLocaleBasename } from 'tools/i18n';

// 决定语言状态 如果 localeBasename 为 null , 语言状态为 en
const localeBasename = getLocaleBasename();
const currentLang = getLangFromLocaleMap(localeBasename);
const LocaleContext = React.createContext({
  currentLang,
  isCN: false,
  isZh: false,
  isRTL: false,
});

export const injectLocale = (WrappedComponent) => (props) => {
  const { currentLang, isRTL, isCN, isZh } = useLocale();

  return (
    <WrappedComponent
      {...props}
      lang={currentLang}
      currentLang={currentLang}
      isRTL={isRTL}
      isCN={isCN}
      isZh={isZh}
    />
  );
};
