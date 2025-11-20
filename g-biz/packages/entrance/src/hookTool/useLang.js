/**
 * Owner: iron@kupotech.com
 */
import isString from 'lodash/isString';
import { isRTLLanguage } from '@utils';
import { useTranslation } from '@tools/i18n';

// 将接收的值中的 '.' 替换成 '_'
function useTransT(t) {
  return function translationLang(key, option) {
    const keys = isString(key) ? key.replace(/\./g, '_') : key;
    return t(keys, option);
  };
}

export default function useLang() {
  const use = useTranslation('entrance');
  const { t, ...other } = use;
  const translationLang = useTransT(t);
  return { t: translationLang, ...other };
}

export function useIsRTL() {
  const { i18n } = useTranslation();
  return isRTLLanguage(i18n.language);
}
