/**
 * Owner: willen@kupotech.com
 */
import { isNumber } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import useLatest from './useLatest';

function useInterval(fn, delay, options) {
  const immediate = options?.immediate;

  const fnRef = useLatest(fn);
  const timerRef = useRef();

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
