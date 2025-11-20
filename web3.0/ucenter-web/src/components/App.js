/**
 * Owner: willen@kupotech.com
 */
import ErrorBoundary from 'components/ErrorBoundary';
import EventProxy from 'components/EventProxy';
import registerModels from 'hocs/registerModels';
import useAppReport from 'hooks/useAppReport';
import useCommonServiceInit from 'hooks/useCommonServiceInit';
import { usePullCountryInfo } from 'hooks/useCountryInfo';
import useLangList from 'hooks/useLangList';
import useLocaleOrder from 'hooks/useLocaleOrder';
import useTwitterAds from 'hooks/useTwitterAds';
import useUser from 'hooks/useUser';
import useYandex from 'hooks/useYandex';
import ErrorFallback from './ErrorFallback';

export default registerModels((props) => {
  const { children } = props;
  useCommonServiceInit();
  useAppReport();
  useYandex();
  useTwitterAds();
  useUser();
  useLangList();
  usePullCountryInfo();
  useLocaleOrder();

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <EventProxy>{children}</EventProxy>
    </ErrorBoundary>
  );
});
