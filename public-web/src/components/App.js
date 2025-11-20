/**
 * Owner: willen@kupotech.com
 */
import { ThemeProvider } from '@kufox/mui';
import { Snackbar, ThemeProvider as KuxProvider } from '@kux/mui';
import ErrorBoundary from 'components/ErrorBoundary';
import EventProxy from 'components/EventProxy';
import registerModels from 'hocs/registerModels';
import useAppReport from 'hooks/useAppReport';
import { usePullCountryInfo } from 'hooks/useCountryInfo';
import useLangList from 'hooks/useLangList';
import useLocaleOrder from 'hooks/useLocaleOrder';
import useNewcomerConfig from 'hooks/useNewcomerConfig'; // 获取福利中心配置
import useTwitterAds from 'hooks/useTwitterAds';
import useUser from 'hooks/useUser';
import useYandex from 'hooks/useYandex';
import ErrorFallback from './ErrorFallback';

export default registerModels((props) => {
  const { children } = props;
  const { SnackbarProvider } = Snackbar;
  useAppReport();
  useYandex();
  useTwitterAds();
  useUser();
  useLangList();
  usePullCountryInfo();
  useLocaleOrder();
  useNewcomerConfig();

  return (
    <KuxProvider>
      <SnackbarProvider>
        <ThemeProvider>
          <ErrorBoundary fallback={<ErrorFallback />}>
            <EventProxy>{children}</EventProxy>
          </ErrorBoundary>
        </ThemeProvider>
      </SnackbarProvider>
    </KuxProvider>
  );
});
