import { useTranslation } from '@tools/i18n';
import { isRTLLanguage } from '@utils';

export default function useRTL() {
  const { i18n } = useTranslation('transfer');
  const { language: currentLang } = i18n || {};
  const isRTL = isRTLLanguage(currentLang);
  return isRTL;
}
