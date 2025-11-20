import React from 'react';
import { AppInitialProps } from 'next/app';
import PageProvider from 'gbiz-next/InitialProvider';
import { type EmotionCache } from '@emotion/react';
import CommonProvider from './CommonProvider';

const SsrProvider: React.FC<{
  children: React.ReactNode;
  pageProps: AppInitialProps;
  emotionCache: EmotionCache;
}> = ({ children, pageProps, emotionCache }) => {
  return (
    <PageProvider value={pageProps}>
      <CommonProvider emotionCache={emotionCache}>{children}</CommonProvider>
    </PageProvider>
  );
};

export default SsrProvider;
