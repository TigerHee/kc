/**
 * Owner: solar@kupotech.com
 */
/**
 * Owner: solar@kupotech.com
 */
import { useRef, useLayoutEffect } from 'react';

export default function useUpdateLayoutEffect(effect, deps) {
  const isInitialMount = useRef(true);
  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    return effect();
  }, deps);
}
