/* eslint-disable @typescript-eslint/no-require-imports */
const I18NextHttpBackend = require("i18next-http-backend/cjs");
const { i18nLoadPath, gbizI18nPath } = require("./constant.config.js");
const { placeholderLocale, createLoadPath } = require('kc-next/config');

module.exports = {
  i18n: {
    defaultLocale: placeholderLocale,
    //移除locals避免预加载所有语言
    locales: [],
  },
  debug: false,
  ns: ["common", "footer", "header", "notice-center", "siteRedirect", "userRestricted"],
  defaultNS: "common",
  serializeConfig: false,
  saveMissing: true,
  use: [I18NextHttpBackend],
  // 必须配置这个以保证zh-hant 这样的小写格式支持
  // https://github.com/i18next/next-i18next/issues/2285
  lowerCaseLng: true,
  cleanCode: true,
  fallbackLng: false,
  backend: {
    loadPath: createLoadPath({ i18nLoadPath, gbizI18nPath }),
    requestOptions: {
      mode: "cors",
      cache: "default",
    },
  },
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
    format: (value, format) => {
      if (format === "uppercase") return value.toUpperCase();
      return value;
    },
    prefix: "{", // 修改起始分隔符
    suffix: "}", // 修改结束分隔符
  },
};
