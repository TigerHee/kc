import { useCallback, useRef, useState, useEffect } from 'react';

interface Options {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export const useDebounceFn = <T extends (...args: any[]) => any>(
  fn: T,
  options?: Options
) => {
  const { wait = 0, leading = false, trailing = true, maxWait = Infinity } = options || {};
  const timeoutIdRef = useRef(0);
  const [result, setResult] = useState<ReturnType<T> | undefined>(undefined);
  const [isCancelled, setIsCancelled] = useState(false);
  const lastCallTimeRef = useRef(0);
  const scheduledFnRef = useRef<(...args: any[]) => any>(() => { });

  const run = useCallback(
    (...args: Parameters<T>) => {
      setIsCancelled(false);
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;
      const timeToWait = Math.min(maxWait, Math.max(0, wait - timeSinceLastCall));

      lastCallTimeRef.current = now;

      if (leading && timeSinceLastCall >= wait) {
        scheduledFnRef.current = () => fn(...args);
        setResult(scheduledFnRef.current());
        return;
      }

      clearTimeout(timeoutIdRef.current);

      timeoutIdRef.current = setTimeout(async () => {
        if (!isCancelled && trailing) {
          scheduledFnRef.current = () => fn(...args);
          setResult(scheduledFnRef.current());
        }
      }, timeToWait) as unknown as number;
    },
    [fn, wait, leading, trailing, maxWait, isCancelled]
  );

  const cancel = useCallback(() => {
    setIsCancelled(true);
    clearTimeout(timeoutIdRef.current);
  }, []);

  const flush = useCallback(async () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      return scheduledFnRef.current();
    }
    return undefined;
  }, []);

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return { run, cancel, flush, result };
};