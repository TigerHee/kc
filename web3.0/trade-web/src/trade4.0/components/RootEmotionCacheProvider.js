/**
 * Owner: jessie@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'dva';
import createCache from '@emotion/cache';
import { CacheProvider } from '@kux/mui/emotion';
import rtlPlugin from 'stylis-plugin-rtl';
import { isRTLLanguage } from 'utils/langTools';


const rtlCache = createCache({ key: 'rtlcss', stylisPlugins: [rtlPlugin] });
const ltrCache = createCache({ key: 'lrtcss' });

const RootEmotionCacheProvider = ({ children }) => {
  const currentLang = useSelector((state) => state.app.currentLang);
  // 通过currentLang来使用哪个cache
  const isRTL = isRTLLanguage(currentLang);
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
