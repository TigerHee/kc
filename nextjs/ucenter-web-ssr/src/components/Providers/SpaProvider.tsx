import '@/tools/i18n/client';
import PageProvider from 'gbiz-next/InitialProvider';
import { getCurrentBaseName } from 'kc-next/i18n';
import { AppInitialProps } from 'next/app';
import dynamic from 'next/dynamic';
import React from 'react';
import { type EmotionCache } from '@emotion/react';
import CommonProvider from './CommonProvider';

// 仅在客户端加载 BrowserRouter
const BrowserRouter = dynamic(
  () => import('react-router-dom').then((mod) => mod.BrowserRouter),
  { ssr: false }
);

const SpaProvider: React.FC<{
  children: React.ReactNode;
  pageProps: AppInitialProps;
  emotionCache: EmotionCache;
}> = ({ children, pageProps, emotionCache }) => {
  const basename = getCurrentBaseName();

  return (
    <PageProvider value={pageProps}>
      <BrowserRouter basename={basename}>
        <React.Suspense fallback={null}>
          <CommonProvider emotionCache={emotionCache}>{children}</CommonProvider>
        </React.Suspense>
      </BrowserRouter>
    </PageProvider>
  );
};

export default SpaProvider;
