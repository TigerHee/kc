/**
 * Owner: odan.ou@kupotech.com
 */
import { useCallback, useState } from 'react';
import useNewRef from './useNewRef';

const useLoading = (InitLoading = false) => {
  const [loading, setLoading] = useState(InitLoading);
  const loadingRef = useNewRef(loading);

  const onLoadingChange = useCallback(
    (state) => {
      loadingRef.current = state;
      setLoading(state);
    },
    [loadingRef],
  );

  const onLoadingStart = useCallback(() => {
    onLoadingChange(true);
  }, [onLoadingChange]);

  const onLoadingEnd = useCallback(() => {
    onLoadingChange(false);
  }, [onLoadingChange]);

  const isLoading = useCallback(() => {
    return loadingRef.current === true;
  }, [loadingRef]);

  const onLoading = useCallback(() => {
    onLoadingStart();
    return () => onLoadingEnd();
  }, [onLoadingStart, onLoadingEnd]);

  return {
    loading,
    loadingRef,
    onLoading,
    onLoadingChange,
    onLoadingStart,
    onLoadingEnd,
    isLoading,
  };
};

export default useLoading;
