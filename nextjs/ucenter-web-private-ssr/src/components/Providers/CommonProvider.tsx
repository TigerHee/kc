import Layout from '@/components/Layout';
import ThemeChange,{DEFAULT_THEME} from '@/components/ThemeChange';
import useAppReport from '@/hooks/useAppReport';
import useRTL from '@/hooks/useRTL';
import { getDvaApp } from '@/tools/dva/client';
import { initDvaApp as initServerDvaApp } from '@/tools/dva/server';
import { type EmotionCache } from '@emotion/react';
import {
  EmotionCacheProvider,
  Snackbar as SnackbarOld,
  ThemeProvider as ThemeProviderOld,
  CssBaseline,
} from '@kux/mui';
import { CacheProvider, Snackbar, ThemeProvider } from '@kux/mui-next';
import { useInitialProps } from 'gbiz-next/InitialProvider';
import { useTwitterAds } from 'gbiz-next/hooks';
import React, { useMemo } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
// import { setCsrf } from 'gbiz-next/request';
import { IS_CLIENT_ENV, IS_SERVER_ENV } from 'kc-next/env';
import useYandex from '@/hooks/useYandex';
import { getTenantConfig } from '@/tenant';

interface ICommonProviderProps {
  children: React.ReactNode;
  emotionCache: EmotionCache;
}

const { SnackbarProvider } = Snackbar;

/**
 * 重要 这个组件是一个通用的布局组件，SPA & SSR都可以在这里使用
 * 重要 error/404/500/xxx 组件无需使用全局布局
 * 它会提供一些全局的功能，比如主题、缓存、通知等,只有这里的全局功能才会在SPA中生效
 */
export default function CommonProvider(props: ICommonProviderProps) {
  const { children } = props;
  const pageProps = useInitialProps();
  const isRTL = useRTL();

  // 这个会在客户端和服务端都执行一次
  // 相当于服务端会执行两次 initDvaApp，一次在 withCommonProps 中，一次在这里；通过 initialDvaState 来保证状态一致
  const store = useMemo(() => {
    // 提前手动设置 csrf 到请求库，保证 csrf 可用；
    // 因为直出的页面，在客户端不会等 user 接口了，会直接发起请求，需要保证 csrf 可用
    // if (pageProps?.initialDvaState?.user?.user?.csrf) {
    //   setCsrf(pageProps.initialDvaState?.user?.user?.csrf);
    // }
    // 服务端默认初始化全部 model，塞入初始状态
    // 客户端按需初始化 model
    const dvaApp = IS_SERVER_ENV
      ? initServerDvaApp({
        initialState: pageProps ? pageProps.initialDvaState : {},
      })
      : getDvaApp();
    return dvaApp._store;
  }, []);

  useAppReport();
  useYandex();
  useTwitterAds();
  // useLocaleOrder();

  const serverTheme = useMemo(()=>{
    if(IS_CLIENT_ENV){
      return undefined;
    }
    if(getTenantConfig().common.forceLightTheme){
      return 'light';
    }
    return pageProps?.theme || DEFAULT_THEME;
  }, []);

  return (
    <CacheProvider isRTL={isRTL} value={props.emotionCache}>
      <ThemeProvider theme={serverTheme}>
        <EmotionCacheProvider isRTL={isRTL} value={props.emotionCache}>
          <ThemeProviderOld theme={serverTheme}>
            <ThemeChange >
              <SnackbarProvider>
                <SnackbarOld.SnackbarProvider>
                  <ReduxProvider store={store}>
                    <CssBaseline />
                    {pageProps ? <Layout>{children}</Layout> : children}
                  </ReduxProvider>
                </SnackbarOld.SnackbarProvider>
              </SnackbarProvider>
            </ThemeChange>
          </ThemeProviderOld>
        </EmotionCacheProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
