/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TDK_EXCLUDE_PATH } from './config';

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
      import('@kc/tdk').then(({ default: tdkManager }) => {
        tdkManager(currentLang);
      });
    }
  }, [location, currentLang]);
};
