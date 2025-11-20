import Layout from '@/components/Layout';
import useAppReport from '@/hooks/useAppReport';
import useRTL from '@/hooks/useRTL';
import { CacheProvider, Snackbar, ThemeProvider } from '@kux/mui-next';
import {
  EmotionCacheProvider,
  ThemeProvider as ThemeProviderOld,
  Snackbar as SnackbarOld,
} from '@kux/mui';
import { type EmotionCache } from '@emotion/react';
import { useTwitterAds } from 'gbiz-next/hooks';
import { useInitialProps } from 'gbiz-next/InitialProvider';
import useLocaleOrder from '@/hooks/useLocaleOrder';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { getDvaApp } from '@/tools/dva';
import ThemeChange from '@/components/ThemeChange';
import useYandex from '@/hooks/useYandex';

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
  const store = getDvaApp()._store;

  useAppReport();
  useYandex();
  useTwitterAds();
  useLocaleOrder();
  return (
    <CacheProvider isRTL={isRTL} value={props.emotionCache}>
      <ThemeProvider>
        <EmotionCacheProvider isRTL={isRTL} value={props.emotionCache}>
          <ThemeProviderOld>
            <ThemeChange>
              <SnackbarProvider>
                <SnackbarOld.SnackbarProvider>
                  <ReduxProvider store={store}>
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
