/**
 * Owner: jesse.shao@kupotech.com
 */

import _ from "lodash";
import pathToRegexp from 'path-to-regexp';

const RTLLangs = ['ar_AE', 'ur_PK'];

/**
 * 是否是RTL语种
 * @param {String} lang 语种
 * @returns Boolean
 */
export const isRTLLanguage = lang => {
  return RTLLangs.includes(lang);
};


export const languages = window?.__KC_LANGUAGES__?.__ALL__ || [];

export const allLanguages = window?.__KC_LANGUAGES__?.__ALL__ || [];

export const getInitBase = () => {
  const webBase = window.location.pathname.indexOf('/land') !== -1 ? '/land/' : '/';
  const webBaseName = webBase.substr(1, webBase.length - 2);
  return {
    webBase,
    webBaseName
  };
};

export const localeMap = languages.reduce(
  (acc, lang) => {
      const value = window.__KC_LANGUAGES_BASE_MAP__.langToBase[lang] || window._DEFAULT_LOCALE_;
      acc[lang] = value;
      return acc;
  },
  {},
);


export const allLocaleMap = allLanguages.reduce(
  (acc, lang) => {
      const value = window.__KC_LANGUAGES_BASE_MAP__.langToBase[lang] || window._DEFAULT_LOCALE_;
      acc[lang] = value;
      return acc;
  },
  {},
);

export const getLocalBase = () => {
  const { pathname } = window.location;
  const pathRe = pathToRegexp('/:locale/land/(.*)?');
  const execResult = pathRe.exec(pathname);
  const localeBasenameFromPath = execResult && execResult[1];
  const matchLocaleMap = Object.entries(allLocaleMap).filter(([, val]) => val === localeBasenameFromPath);
  const isExist = matchLocaleMap && (!!matchLocaleMap.length) && matchLocaleMap[0][0] || undefined;
  return {
      isExist,
      localeBasenameFromPath: isExist ? localeBasenameFromPath : '',
  };
};



const { isExist, localeBasenameFromPath } = getLocalBase();
export const DEFAULT_LANG = isExist || window._DEFAULT_LANG_;
// if (isExist && localeBasenameFromPath !== 'en') {
//     window.routerBase = `/${localeBasenameFromPath}/land`;
// } else {
//     window.routerBase = '/land';
// }

export const _BASE_ = window.routerBase;

export const getPathByLang = lang => {
  return localeMap[lang];
};

export const getCurrentLangFromPath = () => {
  return isExist || window._DEFAULT_LANG_;
};
