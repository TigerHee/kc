/**
 * Owner: ella@kupotech.com
 */
import { useEffect } from 'react';
import { useLocale } from '@kucoin-base/i18n';
import { getPathByLang } from 'tools/i18n';

export default () => {
  const { currentLang } = useLocale();

  useEffect(() => {
    if (document && document.documentElement) {
      const langPath = getPathByLang(currentLang);
      document.documentElement.setAttribute('lang', langPath);
    }
  }, [currentLang]);
};
