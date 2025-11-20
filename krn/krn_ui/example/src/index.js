/**
 * Owner: willen@kupotech.com
 */
import React, { useState } from 'react';
import { ThemeProvider, DebugBar } from '@krn/ui';
import { ThemeProvider as EThemeProvider } from '@emotion/react';
import Router from './router';

// const options = {
//   loadingIconSource: {uri: 'https://www.kucoin.com/kucoin-base-web/img/logo/192.png'},
//   loadingIconSource: require('../../src/assets/dark/search.png')
// }
export default () => {
  const [debugBarVisible, setDebugBarVisible] = useState(true);
  return (
    <ThemeProvider EmotionProviderInstance={EThemeProvider} >
      <Router />
      <DebugBar enableBar={debugBarVisible} setEnableBar={setDebugBarVisible} />
    </ThemeProvider>
  );
};
