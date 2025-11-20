/**
 * Owner: sean.shi@kupotech.com
 */
import { useTranslation, isRTLLanguage } from 'tools/i18n';

// 将接收的值中的 '.' 替换成 '_'
function useTransT(t) {
  return function translationLang(key: string, option?: any) {
    return t(key, option);
  };
}

export default function useLang() {
  const use = useTranslation('entrance');
  const { t, ...other } = use;
  const translationLang = useTransT(t);
  return { t: translationLang, ...other };
}

export function useIsRTL() {
  const { i18n } = useTranslation('entrance');
  return isRTLLanguage(i18n.language);
}
