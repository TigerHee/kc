/**
 * Owner: tiger@kupotech.com
 * 在组件卸载（unmount）时执行的 Hook
 */
import { useEffect } from 'react';
import useLatest from './useLatest';

const useUnmount = (fn) => {
  const fnRef = useLatest(fn);

  useEffect(() => {
    return () => {
      fnRef.current();
    };
  }, []);
};

export default useUnmount;
