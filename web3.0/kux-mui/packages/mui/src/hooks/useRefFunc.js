/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

function useRefFunc(fn) {
  const ref = React.useRef();
  ref.current = fn;
  const cacheFn = React.useCallback((...arg) => {
    ref.current(...arg);
  }, []);
  return cacheFn;
}

export default useRefFunc;
