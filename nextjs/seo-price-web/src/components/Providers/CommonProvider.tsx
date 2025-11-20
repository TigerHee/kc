import Layout from '@/components/Layout';
import useAppReport from '@/hooks/useAppReport';
import useTwitterAds from '@/hooks/useTwitterAds';
import {
  ThemeProvider,
  CacheProvider,
  Snackbar,
  Notification,
} from '@kux/mui-next';
import StoreProvider from '@/components/Providers/StoreProvider';
import useRTL from '@/hooks/useRTL';
import { useInitialProps } from 'gbiz-next/InitialProvider';
import useLocaleOrder from '@/hooks/useLocaleOrder';

/**
 * 重要 这个组件是一个通用的布局组件，SPA & SSR都可以在这里使用
 * 重要 error/404/500/xxx 组件无需使用全局布局
 * 它会提供一些全局的功能，比如主题、缓存、通知等,只有这里的全局功能才会在SPA中生效
 */
export default function CommonProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageProps = useInitialProps();
  const isRTL = useRTL();
  useAppReport();
  useTwitterAds();
  useLocaleOrder();

  return (
    <StoreProvider>
      <CacheProvider isRTL={isRTL}>
        <ThemeProvider>
          <Snackbar.SnackbarProvider>
            <Notification.NotificationProvider>
              {pageProps ? <Layout>{children}</Layout> : children}
            </Notification.NotificationProvider>
          </Snackbar.SnackbarProvider>
        </ThemeProvider>
      </CacheProvider>
    </StoreProvider>
  );
}
