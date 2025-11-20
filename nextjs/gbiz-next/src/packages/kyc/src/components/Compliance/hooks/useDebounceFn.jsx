/**
 * Owner: tiger@kupotech.com
 * 用来处理防抖函数的 Hook
 */
import { debounce } from 'lodash-es';
import { useMemo } from 'react';
import useLatest from './useLatest';
import useUnmount from './useUnmount';

function useDebounceFn(fn, options) {
  const fnRef = useLatest(fn);

  const wait = options?.wait ?? 1000;

  const debounced = useMemo(() => {
    return debounce(
      (...args) => {
        return fnRef.current(...args);
      },
      wait,
      options,
    );
  }, []);

  useUnmount(() => {
    debounced.cancel();
  });

  return {
    run: debounced,
    cancel: debounced.cancel,
    flush: debounced.flush,
  };
}

export default useDebounceFn;
