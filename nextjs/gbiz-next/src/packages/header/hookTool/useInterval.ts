/**
 * Owner: willen@kupotech.com
 */
import { useCallback, useEffect, useRef } from 'react';
import { isNumber } from 'lodash-es';
import useLatest from './useLatest';

function useInterval(fn: () => void, delay: number, options?: { immediate?: boolean }) {
  const immediate = options?.immediate;

  const fnRef = useLatest(fn);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (!isNumber(delay) || delay < 0) return;

    if (immediate) {
      fnRef.current();
    }
    timerRef.current = setInterval(() => {
      fnRef.current();
    }, delay);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [delay, fnRef, immediate]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  return clear;
}

export default useInterval;
