// import i18next from "i18next";
import { useTranslation as i18nTranslation, Trans as I18nTrans } from "next-i18next";
// import { usePageProps } from "provider/PageProvider";
import { bootConfig } from "kc-next/boot";
import React from "react";

// import * as Sentry from "@sentry/nextjs";

// i18next.use(initReactI18next).init({
//   // 必须配置这个以保证zh-hant 这样的小写格式支持
//   // https://github.com/i18next/next-i18next/issues/2285
//   lowerCaseLng: true,
//   resources: {},
//   lng: bootConfig.currentLocale,
//   parseMissingKeyHandler: (key, defaultValue) => {
//     Sentry.captureMessage(`【gbiz-next - ${key}】`);
//     return defaultValue;
//   },
// });

// function addResourceBundlesFiltered(translations) {
//   Object.entries(translations).forEach(([lang, namespaces]) => {
//     Object.entries(namespaces as { [key: string]: any })
//       .filter(([ns]) => ns !== "common") // 过滤 common
//       .forEach(([ns, resources]) => {
//         i18next.addResourceBundle(lang, ns, resources);
//       });
//   });
// }

// export function LocaleProvider({ children}) {
//   const pageProps = usePageProps();
//   const i18nData = pageProps?._nextI18Next || {};
//   const translatesMap = i18nData?.initialI18nStore || {};
//   addResourceBundlesFiltered(translatesMap);
//   const currentLocale = bootConfig.currentLocale;

//   if (i18next.language !== currentLocale) {
//     i18next.changeLanguage(currentLocale);
//   }

//   // CSR 补丁（SSR 应已注入资源）
//   // useEffect(() => {
//   //   if (i18next.language !== currentLocale) {
//   //     i18next.changeLanguage(currentLocale);
//   //   }
//   // }, [currentLocale]);

//   return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
// }
const RTLLangs = ['ar_AE', 'ur_PK'];
export const isRTLLanguage = (lang: string) => RTLLangs.includes(lang);

export const useTranslation = (ns: string, options?: any) => {
  const { t: _it, ...props } = i18nTranslation(ns, options);
  return {
    ...props,
    t: (key: string, variables?: Record<string, any>): any => {
      return _it(key, {
        brandName: bootConfig._BRAND_NAME_,
        siteBaseCurrency: bootConfig._BASE_CURRENCY_ || "USDT",
        ...(variables || {}),
      });
    },
  };
};

export type TransProps = {
  i18nKey: string;
  ns?: string;
  values?: Record<string, any>;
  children?: React.ReactNode;
  [key: string]: any;
};
export const Trans = ({ children, values, ...props }: TransProps) => {
  const mergedValues = {
    brandName: bootConfig._BRAND_NAME_,
    ...(values || {}),
  };

  return (
    <I18nTrans {...props} values={mergedValues}>
      {children}
    </I18nTrans>
  );
};

