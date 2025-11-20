/*
 * @owner: borden@kupotech.com
 */
import { useMemo, useEffect } from 'react';
import { debounce } from 'lodash';
import { useLatest } from '@kux/mui';

function useDebounceFn(fn, options) {
  const fnRef = useLatest(fn);

  const wait = options?.wait ?? 1000;

  const debounced = useMemo(
    () =>
      debounce(
        (...args) => {
          return fnRef.current(...args);
        },
        wait,
        options,
      ),
    [],
  );

  useEffect(() => {
    return () => {
      debounced.cancel();
    };
  }, [debounced]);

  return {
    run: debounced,
    cancel: debounced.cancel,
    flush: debounced.flush,
  };
}

export default useDebounceFn;
