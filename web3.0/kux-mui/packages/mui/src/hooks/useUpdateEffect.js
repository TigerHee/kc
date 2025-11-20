/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect } from 'react';
import { noop } from 'lodash-es';

const useUpdateEffect = (fn = noop, deps = []) => {
  const isMounted = React.useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    }
    return fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useUpdateEffect;
