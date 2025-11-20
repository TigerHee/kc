/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { zElanguages } from 'config/base';
import { useEffect } from 'react';

const SyncZendeskLang = (props) => {
  const { currentLang } = props;

  useEffect(() => {
    let intervalId = setInterval(() => {
      const { zE } = window;
      if (zE) {
        // zE('webWidget', 'setLocale', zElanguages[currentLang] || zElanguages.en_US);
        zE('messenger:set', 'locale', zElanguages[currentLang] || zElanguages.en_US);
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    }, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, [currentLang]);

  return null;
};

export default injectLocale(SyncZendeskLang);
