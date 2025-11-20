import Layout from '@/components/Layout';
import useAppReport from '@/hooks/useAppReport';
import useRTL from '@/hooks/useRTL';
import { ConfigStoreProvider } from '@/store/config.ts';
import {
  CacheProvider,
  Snackbar,
  ThemeProvider,
} from '@kux/mui-next';
import { useTwitterAds } from 'gbiz-next/hooks';
import { useInitialProps } from 'gbiz-next/InitialProvider';
import React from 'react';
import ThemeChange from '../ThemeChange';
import useLocaleOrder from '@/hooks/useLocaleOrder';
interface ICommonProviderProps {
  children: React.ReactNode;
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

  useLocaleOrder();
  useAppReport();
  useTwitterAds();

  return (
    <ConfigStoreProvider>
      <CacheProvider isRTL={isRTL}>
        <ThemeProvider>
          <ThemeChange>
            <SnackbarProvider>
              {pageProps ? (
                <Layout>{children}</Layout>
              ) : children}
            </SnackbarProvider>
          </ThemeChange>
        </ThemeProvider>
      </CacheProvider>
    </ConfigStoreProvider>
  );
}
