/**
 * Owner: gavin.liu1@kupotech.com
 */
import { useSelector } from 'dva'
import { isRTLLanguage } from 'utils/langTools';

export const useLocale = () => {
  const { currentLang } = useSelector(state => state.app)
  const isRTL = isRTLLanguage(currentLang)
  const isRussian = currentLang === 'ru_RU'
  const isES = currentLang === 'es_ES'
  const isPL = currentLang === 'pl_PL'
  const isEN = currentLang === 'en_US'

  return {
    currentLang,
    isRTL,
    isRussian,
    isES,
    isPL,
    isEN,
  }
}
