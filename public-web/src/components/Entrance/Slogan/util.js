/**
 * Owner: willen@kupotech.com
 */
import { includes } from 'lodash';

const fontSizeMap = {
  slogan: {
    default: {
      fontSize: '56px',
      lineHeight: '56px',
    },
    normal: {
      fontSize: '40px',
      lineHeight: '56px',
    },
    small: {
      fontSize: '32px',
      lineHeight: '40px',
    },
    small2: {
      fontSize: '28px',
      lineHeight: '36px',
    },
  },
  subSloganDesc: {
    default: {
      fontSize: '34px',
      lineHeight: '56px',
    },
    normal: {
      fontSize: '26px',
      lineHeight: '40px',
    },
    small: {
      fontSize: '24px',
      lineHeight: '46px',
    },
    small2: {
      fontSize: '20px',
      lineHeight: '42px',
    },
  },
};

const getFontSizeKeyByLang = (language) => {
  const defaultLang = ['zh_CN', 'zh_HK'];
  const normalLang = ['en_US'];
  const small2Lang = ['ru_RU'];

  if (includes(defaultLang, language)) return 'default';
  if (includes(normalLang, language)) return 'normal';
  if (includes(small2Lang, language)) return 'small2';
  return 'small';
};

export function getSloganStyle(type, lang) {
  return fontSizeMap[type][getFontSizeKeyByLang(lang)];
}
