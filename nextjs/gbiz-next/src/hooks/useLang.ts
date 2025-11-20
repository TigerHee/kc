import { getCurrentLang } from 'kc-next/i18n';
import { RTL_LANGUAGES } from 'config/base';

export default function useLang() {
  const currentLang = getCurrentLang();
  
  return {
    currentLang,
    isRTL: RTL_LANGUAGES.includes(currentLang),
  };
}
