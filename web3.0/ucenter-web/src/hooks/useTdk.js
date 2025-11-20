/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import config from 'config';
import { TDK_EXCLUDE_PATH } from 'config/base';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const { v2ApiHosts } = config;
const _API_HOST = v2ApiHosts.WEB;

let setHost = false;

const excludePath = (pathname) => {
  return TDK_EXCLUDE_PATH.some((item) => item.test(pathname));
};

export default () => {
  const { currentLang } = useLocale();
  const location = useLocation();
  useEffect(() => {
    import('@kc/tdk').then(({ default: tdkManager }) => {
      if (!setHost) {
        tdkManager.init({
          host: _API_HOST,
          brandName: window._BRAND_NAME_,
        });
        setHost = true;
      }
      if (!excludePath(location.pathname)) {
        tdkManager(currentLang);
      }
    });
  }, [location.pathname, currentLang]);
};
