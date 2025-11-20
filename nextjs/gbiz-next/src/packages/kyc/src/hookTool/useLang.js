/**
 * Owner: tiger@kupotech.com
 */
import { useTranslation } from 'tools/i18n';

// 将接收的值中的 '.' 替换成 '_'
function useTransT(t) {
  return function translationLang(key, option) {
    return t(key, option);
  };
}

export default function useLang() {
  const use = useTranslation('kyc');
  const { t, ...other } = use;
  const translationLang = useTransT(t);
  return { t: translationLang, _t: translationLang, ...other };
}
