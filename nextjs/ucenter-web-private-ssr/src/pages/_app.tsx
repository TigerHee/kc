import 'requestidlecallback';
import './global.css';
import './reset.css';
// import './mui.css';
import SsrProvider from '@/components/Providers/SsrProvider';
import createEmotionCache from '@/components/Providers/createEmotionCache';
import { moduleManager } from '@/core';
import * as telemetry from '@/core/telemetryModule';
import { routerConfig } from '@/routers/SpaPage';
import { getDvaApp, initBaseModels } from '@/tools/dva/client';
import { CacheProvider, type EmotionCache } from '@emotion/react';
import { setup as setupkuxDesign } from '@kux/design';
import '@kux/design/dist/style.css';
import 'gbiz-next/Footer.css';
import 'gbiz-next/Header.css';
import 'gbiz-next/compliance';
import 'gbiz-next/entrance.css';
import { IS_CLIENT_ENV, IS_SSR_MODE } from 'kc-next/env';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import nextI18nextConfig from '../../next-i18next.config';
import { setCsrf } from 'gbiz-next/request';
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import { initInterceptor } from '@/tools/request';
import useRTL from '@/hooks/useRTL';


if (IS_CLIENT_ENV) {
  window.__KC_CRTS__ = routerConfig;
}

const SpaProvider = dynamic(() => import('@/components/Providers/SpaProvider'), {
  ssr: false, // SpaProvider 仅客户端运行
});

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

type KcAppProps = AppProps & { emotionCache?: EmotionCache };

// 在客户端初始化自己的 DVA 应用
if (IS_CLIENT_ENV) {
  // 绑定指纹拦截器
  initInterceptor();
  if (window.__NEXT_DATA__?.props?.pageProps?.initialDvaState?.user) {
    setCsrf(window.__NEXT_DATA__?.props?.pageProps?.initialDvaState?.user?.user?.csrf);
  }
  const app = getDvaApp();
  initBaseModels(app);
}

function App({ Component, pageProps, emotionCache }: KcAppProps) {
  // SPA 模式下，使用SpaProvider
  const GlobalProvider = IS_SSR_MODE ? SsrProvider : SpaProvider;
  const isRTL = useRTL();
  // 若无 emotionCache 则提供客户端兜底 cache（CSR/水合阶段会用）
  const cache = emotionCache || createEmotionCache(isRTL);

  return (
    <ErrorBoundary scene={SCENE_MAP.root.index}>
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
    : null,
);
