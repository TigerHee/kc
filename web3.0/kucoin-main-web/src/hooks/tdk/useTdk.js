/**
 * Owner: willen@kupotech.com
 */
import { useEffect } from 'react';
import { useLocale } from '@kucoin-base/i18n';
import { useLocation } from 'react-router-dom';
import { TDK_EXCLUDE_PATH } from './config';
import tdkManager from '@kc/tdk';

const excludePath = (location) => {
  const { pathname } = location;
  return TDK_EXCLUDE_PATH.some((item) => {
    if (typeof item === 'function') {
      return item(location);
    }
    return item.test(pathname);
  });
};

export default () => {
  const { currentLang } = useLocale();
  const location = useLocation();
  useEffect(() => {
    if (!excludePath(location)) {
      tdkManager(currentLang);
    }
  }, [location, currentLang]);
};
