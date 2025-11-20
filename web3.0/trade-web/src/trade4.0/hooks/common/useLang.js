/**
 * Owner: borden@kupotech.com
 */
import { useSelector } from 'dva';
import { isRTLLanguage } from 'utils/langTools';

export const useIsRTL = () => {
  const currentLang = useSelector((state) => state.app.currentLang);
  return isRTLLanguage(currentLang);
};

export const isRTL = () => {
  return isRTLLanguage();
};
