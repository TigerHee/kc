import { useState, useEffect } from 'react';
import { usePageProps } from 'provider/PageProvider';
import { IS_MOBILE_SSG_ENV } from 'kc-next/env';

export default function useIsH5() {
  const { platform } = usePageProps();
  const IS_APP = platform === 'app';
  const IS_MOBILE = platform === 'mobile';

  const getIsH5 = () =>
    IS_APP || IS_MOBILE || IS_MOBILE_SSG_ENV || (typeof window !== 'undefined' ? window.innerWidth < 500 : false);

  const [isH5, setIsH5] = useState(getIsH5);

  useEffect(() => {
    function handleResize() {
      const _isH5 = getIsH5();
      setIsH5(_isH5);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isH5;
}
