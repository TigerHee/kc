/**
 * Owner: willen@kupotech.com
 */
import createCache from '@emotion/cache';
import { useLocale } from '@kucoin-base/i18n';
import { CacheProvider } from '@emotion/react';
import { useEffect, useState } from 'react';
import rtlPlugin from 'stylis-plugin-rtl';

const rtlCache = createCache({ key: 'rtlcss', stylisPlugins: [rtlPlugin] });
const ltrCache = createCache({ key: 'lrtcss' });

const RootEmotionCacheProvider = ({ children }) => {
  // 通过currentLang来使用哪个cache
  const { isRTL } = useLocale();

  const [cache, setCache] = useState(ltrCache);

  useEffect(() => {
    // 根据currentLang
    // 改变html的dir
    if (isRTL) {
      document.documentElement.setAttribute('dir', 'rtl');
      setCache(rtlCache);
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      setCache(ltrCache);
    }
  }, [isRTL]);

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

export default RootEmotionCacheProvider;
