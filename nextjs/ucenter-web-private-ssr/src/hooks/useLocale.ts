import { useLang } from 'gbiz-next/hooks';

export const useLocale = () => {
  const { isRTL, currentLang } = useLang();

  return {
    currentLang,
    isRTL,
    isCN: currentLang === 'zh_CN',
    isZh: currentLang === 'zh_CN' || currentLang === 'zh_HK',
  };
};

export default useLocale;
