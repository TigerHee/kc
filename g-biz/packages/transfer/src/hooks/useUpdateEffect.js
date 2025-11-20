/**
 * Owner: solar@kupotech.com
 */
import { useEffect, useRef } from 'react';

function useUpdateEffect(effect, dependencies) {
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}

export default useUpdateEffect;
