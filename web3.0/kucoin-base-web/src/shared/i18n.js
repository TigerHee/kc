/*
 * @Author: garuda@kupotech.com
 * @Date: 2025-07-09 10:40:55
 * @LastEditors: garuda@kupotech.com
 * @LastEditTime: 2025-09-15 10:25:52
 */
import React from 'react';
import loadable from '@loadable/component';
import storage from '@kucoin-base/syncStorage';
import {
  getLangFromBase,
  getBaseFromLang,
  isRTLLanguage,
  getCurrentLang,
  getNextLocation,
} from '@utils/i18n';

const currentLang = getCurrentLang();
const currentLangBase = getBaseFromLang(currentLang);
// 默认语言 basename 为 ''
const basename = currentLangBase ? `/${currentLangBase}` : '';
export { currentLang, basename, getLangFromBase, getBaseFromLang, isRTLLanguage };

const replaceRouteWithLang = (lang) => {
  const nextLocation = getNextLocation(basename, lang);
  window.location.replace(nextLocation);
};

const isRTL = isRTLLanguage(currentLang);

const changeLocale = async (nextLocale) => {
  if (nextLocale !== currentLang) {
    storage.setItem('lang', nextLocale);
    replaceRouteWithLang(nextLocale);
  }
};

const contextValue = {
  currentLang: currentLang,
  isCN: currentLang === 'zh_CN',
  isZh: currentLang === 'zh_CN' || currentLang === 'zh_HK',
  isRTL,
  changeLocale,
};
const LocaleContext = React.createContext(contextValue);

export const useLocale = () => React.useContext(LocaleContext);

export const injectLocale = (WrappedComponent) => (props) => {
  const localeProps = React.useContext(LocaleContext);
  return <WrappedComponent {...props} {...localeProps} />;
};

export const LoadableLocaleProvider = loadable(() => System.import('@kucoin-biz/tools'), {
  resolveComponent: (module) => {
    return module.default.LocaleProvider;
  },
});

const EmptyComponent = (props) => <>{props.children}</>;

export const LoadableGbizNextLocaleProvider = loadable(
  async () => {
    try {
      return await System.import('@kucoin-gbiz-next/i18n');
    } catch {
      return {
        LocaleProvider: EmptyComponent,
      };
    }
  },
  {
    resolveComponent: (module) => {
      return module.LocaleProvider;
    }
  },
);

export function LocaleProvider(props) {
  return (
    <LocaleContext.Provider value={contextValue}>
      <LoadableLocaleProvider locale={currentLang} name={props.name}>
        <LoadableGbizNextLocaleProvider locale={currentLang}>
          {props.children}
        </LoadableGbizNextLocaleProvider>
      </LoadableLocaleProvider>
    </LocaleContext.Provider>
  );
}
