/*
 * @owner: borden@kupotech.com
 */
import { useEffect, useState } from 'react';
import { useUpdateEffect } from '@kux/mui';
import useDebounceFn from './useDebounceFn';

function useDebounceEffect(effect, deps, options) {
  const [flag, setFlag] = useState({});

  const { run } = useDebounceFn(() => {
    setFlag({});
  }, options);

  useEffect(() => {
    return run();
  }, deps);

  useUpdateEffect(effect, [flag]);
}

export default useDebounceEffect;
