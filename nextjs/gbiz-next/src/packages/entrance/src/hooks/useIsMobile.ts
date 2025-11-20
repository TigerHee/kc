import { IS_SERVER_ENV } from 'kc-next/env';
import { useInitialProps } from 'provider/InitialProvider';
import { useIsMobile as useClientIsMobile } from '@kux/design';

const useIsMobile = () => {
  const initialProps = useInitialProps();
  const isH5 = useClientIsMobile();

  // console.log('useIsMobile', IS_SERVER_ENV, initialProps?._platform, isH5);

  return IS_SERVER_ENV ? ['mobile', 'app'].includes(initialProps?._platform) : isH5;
};

export default useIsMobile;
