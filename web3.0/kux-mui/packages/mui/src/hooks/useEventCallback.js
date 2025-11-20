/**
 * Owner: victor.ren@kupotech.com
 */
import * as React from 'react';
import useEnhancedEffect from './useEnhancedEffect';

export default function useEventCallback(fn) {
  const ref = React.useRef(fn);
  useEnhancedEffect(() => {
    ref.current = fn;
  });
  return React.useCallback((...args) => (0, ref.current)(...args), []);
}
