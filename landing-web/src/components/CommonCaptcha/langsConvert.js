/**
 * Owner: jesse.shao@kupotech.com
 */

// zh-cn、zh-hk、zh-tw、en、ja、ko、id、ru、ar、es、pt-pt、fr、de

export const LangsMap = {
  zh_CN: 'zh-cn',
  zh_HK: 'zh-hk',
  en_US: 'en',
  es_ES: 'es',
  ko_KR: 'ko',
  ru_RU: 'ru',
  pt_PT: 'pt-pt',
  fr_FR: 'fr',
  de_DE: 'de',
  uk_UA: 'uk',
};

// 语言转换
export const convertLang = (lang) => {
  return LangsMap[lang] || 'en';
};
