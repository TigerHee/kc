import React from 'react';
import 'requestidlecallback';
import './reset.css';
import './global.css';
import './mui.css';
import '@kux/design/dist/style.css';
import 'gbiz-next/Header.css';
import 'gbiz-next/Footer.css';
import 'gbiz-next/entrance.css';
import 'gbiz-next/compliance';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { setup as setupkuxDesign } from '@kux/design';
import { appWithTranslation } from 'next-i18next';
import { IS_SSR_MODE, IS_CLIENT_ENV } from 'kc-next/env';
import SsrProvider from '@/components/Providers/SsrProvider';
import { moduleManager } from '@/core';
import * as telemetry from '@/core/telemetryModule';
import { routerConfig } from '@/routers/SpaPage';
import { getDvaApp } from '@/tools/dva';
import ErrorBoundary, { SCENE_MAP } from '@/components/ErrorBoundary';
import { type EmotionCache } from '@emotion/react';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/components/Providers/createEmotionCache';
import nextI18nextConfig from '../../next-i18next.config';

if (IS_CLIENT_ENV) {
  window.__KC_CRTS__ = routerConfig;
}

// 客户端兜底 cache（CSR/水合阶段会用）
const clientSideEmotionCache = createEmotionCache();

const SpaProvider = dynamic(
  () => import('@/components/Providers/SpaProvider'),
  {
    ssr: false, // SpaProvider 仅客户端运行
  }
);
// 初始化 dva 运行实例
getDvaApp();

// 全局通用的初始化事件 SSR & SPA都会执行
moduleManager.initAll();

// 初始化组件库, 可以根据需要多次调用 https://kux.sit.kucoin.net/next/?path=/docs/1-%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8--api
setupkuxDesign({
  // 设置 KcApp 桥方法对象, 保证所有需要使用 JsBridge 能力的场景(比如app中打开链接、分享)功能正常
  // web3.0 架构中可以使用下面方式获取
  //  `import JsBridge from '@kucoin-base/bridge'`;
  // jsBridge: JsBridge,
  getLottie: () => import('lottie-web'),
});

type MyAppProps = AppProps & { emotionCache?: EmotionCache }

function App({ Component, pageProps, emotionCache }: MyAppProps) {
  // SPA 模式下，使用SpaProvider
  const GlobalProvider = IS_SSR_MODE ? SsrProvider : SpaProvider;

  const cache = emotionCache || clientSideEmotionCache;

  return (
    <ErrorBoundary scene={SCENE_MAP.root.app}>
      <CacheProvider value={cache}>
        <GlobalProvider pageProps={pageProps} emotionCache={cache}>
          <Component {...pageProps} />
        </GlobalProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
}

export default appWithTranslation(
  App,
  IS_SSR_MODE
    ? {
      ...(nextI18nextConfig as any),
      missingKeyHandler: (lng, ns, key) => {
        telemetry.reportIntlMissing(key);
      },
    }
    : null
);
