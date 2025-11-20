import { useEffect, useRef, useState, useCallback } from 'react';

type PollingOptions<T = any, R = any> = {
  // 轮询间隔时间(毫秒)，默认20 * 1000
  interval: number;
  // 是否在组件挂载后自动开始轮询，默认 true
  autoStart?: boolean;
  // 首次执行是否立即进行，false则延迟interval后执行，默认 true
  immediate?: boolean;
  // 轮询函数的初始参数
  initialArgs?: T[];
  // 轮询开始时的回调
  onStart?: () => void;
  // 轮询成功时的回调
  onSuccess?: (result: R) => void;
  // 轮询失败时的回调
  onError?: (error: Error) => void;
  // 轮询完成时的回调（无论成功或失败）
  onComplete?: () => void;
};

type PollingResult<T = any> = {
  // 开始轮询
  start: () => void;
  // 停止轮询
  stop: () => void;
  // 手动触发一次轮询，可传入临时参数
  trigger: (...args: T[]) => Promise<void>;
  // 设置轮询函数的默认参数
  setArgs: (...args: T[]) => void;
  // 轮询是否正在进行中
  isActive: boolean;
  // 轮询函数是否正在执行
  isPending: boolean;
};

/**
 * 支持服务端渲染(SSR)的轮询Hook
 * @param fn 要轮询执行的函数
 * @param options 轮询配置
 * @returns 轮询控制方法和状态
 */
function usePolling<T = any, R = any>(fn: (...args: T[]) => Promise<any>, options: PollingOptions<T, R>): PollingResult<T> {
  const {
    interval = 20 * 1000,
    autoStart = true,
    immediate = true,
    initialArgs = [],
    onStart,
    onSuccess,
    onError,
    onComplete,
  } = options;

  const [isActive, setIsActive] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fnRef = useRef(fn);
  const argsRef = useRef<T[]>(initialArgs);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const clearCurrentTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const execute = useCallback(
    async (...args: T[]) => {
      const currentArgs = args.length > 0 ? args : argsRef.current;

      try {
        setIsPending(true);
        const result = await fnRef.current(...currentArgs);
        onSuccess?.(result);
        return result;
      } catch (error) {
        console.error('Polling function error:', error);
        onError?.(error as Error);
      } finally {
        setIsPending(false);
        onComplete?.();

        if (isActive) {
          timeoutRef.current = setTimeout(() => {
            execute();
          }, interval);
        }
      }
    },
    [isActive, interval, onSuccess, onError, onComplete]
  );

  const start = useCallback(() => {
    // 只在客户端执行
    if (typeof window === 'undefined') return;

    clearCurrentTimeout();

    setIsActive(true);
    onStart?.();

    if (immediate) {
      execute();
      return;
    }
    timeoutRef.current = setTimeout(() => {
      execute();
    }, interval);
  }, [execute, onStart, clearCurrentTimeout, immediate, interval]);

  const stop = useCallback(() => {
    clearCurrentTimeout();
    setIsActive(false);
  }, [clearCurrentTimeout]);

  const trigger = useCallback(
    async (...args: T[]) => {
      const wasActive = isActive;
      if (!wasActive) {
        setIsActive(true);
      }

      try {
        return await execute(...args);
      } finally {
        if (!wasActive) {
          setIsActive(false);
        }
      }
    },
    [execute, isActive]
  );

  const setArgs = useCallback((...args: T[]) => {
    argsRef.current = args;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  return { start, stop, trigger, setArgs, isActive, isPending };
}

export default usePolling;
