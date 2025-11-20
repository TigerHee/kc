import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * 单例回调, 保证回调同一时间只有一个在执行, 针对异步函数, 避免重复调用导致的状态异常
 * @param callback 事件回调
 * @param disable 是否禁用回调调用, true 表示禁用回调, 若为数字, 表示参数 gap
 * @param gap 回调执行的最少时间, 单位ms, 少于这个时间不会再次执行
 * @param sync 是否为同步函数, 若为 true 则本hook不再控制回调的执行状态, 直接调用回调函数, 适用于同步函数, 避免按钮闪烁
 * @returns [fn, isRunning, error]
 */
export function useSingletonCallback<T extends unknown[]>(callback?: (...args: T)=> void | Promise<void>, disable?: boolean | number, gap?: number, sync?: boolean ) {
  /**
   * callback 是否正在运行
   */
  const [isRunning, setIsRunning] = useState(false);
  /**
   * callback 出错的对象, 成功为 null
   */
  const [error, setError] = useState<unknown>(null)

  const isDisable = typeof disable === 'boolean' ? disable : false;
  const gapTime = typeof disable === 'number' ? disable : gap || 0;
  /**
   * 缓存 callback, timer, isRunning
   */
  const cacheRef = useRef({
    callback,
    timer: 0,
    isRunning,
    sync,
  });
  // 更新缓存, 避免 fn 对其产生依赖
  cacheRef.current.callback = callback;
  cacheRef.current.isRunning = isRunning;
  cacheRef.current.sync = sync;

  const fn = useCallback(async (...args: T) => {
    if (cacheRef.current.isRunning || isDisable || !cacheRef.current.callback) return;
    const start = gapTime && Date.now();
    let nextError: unknown = null
    try {
      if (!cacheRef.current.sync) {
        setIsRunning(true);
        await cacheRef.current.callback(...args);
      } else {
        // 同步执行, 直接调用
        cacheRef.current.callback(...args);
      }
    } catch (err: unknown) {
      nextError = err;
    }
    const end = gapTime && Date.now();
    // 不够时间, 则补足时间, 否则延迟时间为 0
    const remain = !gapTime
      ? 0
      : Math.max((gapTime - ((end as number) - (start as number))) || 0, 0);

    cacheRef.current.timer = setTimeout(() => {
      setError(nextError);
      if (!cacheRef.current.sync || cacheRef.current.isRunning) {
        setIsRunning(false);
      }
    }, remain) as unknown as number;
  },[isDisable, gapTime]) ;

  // 清理定时器, 避免组件卸载后更新状态
  useEffect(() => {
    return () => {
      clearTimeout(cacheRef.current.timer as number);
    };
  }, []);

  return [fn, isRunning, error] as const;
}
