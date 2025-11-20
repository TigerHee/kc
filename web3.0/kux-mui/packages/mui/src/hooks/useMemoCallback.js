/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export default function useMemoCallback(func) {
  const funRef = React.useRef(func);
  funRef.current = func;

  const callback = React.useCallback((...args) => funRef.current?.(...args), []);

  return func ? callback : undefined;
}
