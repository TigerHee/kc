import { isNumber } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import useLatest from './useLatest';

type IntervalId = ReturnType<typeof setInterval>;

function useInterval(
  fn: () => void,
  delay?: number,
  options?: { immediate?: boolean }
) {
  const immediate = options?.immediate;

  const fnRef = useLatest(fn);
  const timerRef = useRef<IntervalId | null>(null);

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
        timerRef.current = null;
      }
    };
  }, [delay, fnRef, immediate]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return clear;
}

export default useInterval;
