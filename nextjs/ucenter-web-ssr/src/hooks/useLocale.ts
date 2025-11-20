import { getCurrentLang } from 'kc-next/boot';

const useLocale = () => {
  const currentLang = getCurrentLang();
  return {
    currentLang
  };
};

export default useLocale;
