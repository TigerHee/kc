import React, { useState, useEffect } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from 'emotion/index';
import rtlPlugin from 'stylis-plugin-rtl';

const rtlCache = createCache({ key: 'rtlcss', stylisPlugins: [rtlPlugin] });
const ltrCache = createCache({ key: 'lrtcss' });

const EmotionCacheProvider = ({ children, isRTL, value = {}, ...props }) => {
  const [cache, setCache] = useState(ltrCache);

  useEffect(() => {
    if (isRTL) {
      document.documentElement.setAttribute('dir', 'rtl');
      setCache(rtlCache);
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      setCache(ltrCache);
    }
  }, [isRTL]);

  return (
    <CacheProvider value={{ ...cache, ...value }} {...props}>
      {children}
    </CacheProvider>
  );
};

export default EmotionCacheProvider;
