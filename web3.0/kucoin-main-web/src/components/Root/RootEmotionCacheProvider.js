/**
 * Owner: willen@kupotech.com
 */
import { useEffect, useState } from 'react';
import createCache from '@emotion/cache';
// import { CacheProvider } from '@kufox/mui';
import EmotionCacheProvider from '@kux/mui/EmotionCacheProvider';
import rtlPlugin from 'stylis-plugin-rtl';
import { useLocale } from '@kucoin-base/i18n';

const rtlCache = createCache({ key: 'rtlcss', stylisPlugins: [rtlPlugin] });
const ltrCache = createCache({ key: 'lrtcss' });

const RootEmotionCacheProvider = ({ children }) => {
  const [cache, setCache] = useState(ltrCache);
  const { isRTL } = useLocale();

  useEffect(() => {
    // 改变html的dir
    if (isRTL) {
      document.documentElement.setAttribute('dir', 'rtl');
      setCache(rtlCache);
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      setCache(ltrCache);
    }
  }, [isRTL]);

  return <EmotionCacheProvider isRTL={isRTL}>{children}</EmotionCacheProvider>;
};

export default RootEmotionCacheProvider;
