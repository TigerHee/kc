/**
 * Owner: tiger@kupotech.com
 */
import isString from 'lodash-es/isString';
import { useTranslation } from 'tools/i18n';

// 将接收的值中的 '.' 替换成 '_'
function useTransT(t) {
  return function translationLang(key, option) {
    const keys = isString(key) ? key.replace(/\./g, '_') : key;
    return t(keys, option);
  };
}

export default function useLang() {
  const use = useTranslation('common-base');
  const { t, ...other } = use;
  const translationLang = useTransT(t);
  return { t: translationLang, ...other };
}
