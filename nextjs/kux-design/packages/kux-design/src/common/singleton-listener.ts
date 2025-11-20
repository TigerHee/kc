import { useEffect, useState } from 'react';

export type ISingletonCallback = () => void;

/**
 * 监听函数
 * * 返回取消监听的方法
 */
export type ISubscribe = (callback: ISingletonCallback) => () => void;

/**
 * 创建单例监听器, 使用场景参考 useIsMobile, useResponsive
 */
export function createSingletonListener<T>(subscribe: ISubscribe, getSnapshot: () => T) {
  const callbacks = new Set<ISingletonCallback>();

  const onValUpdate = () => {
    try {
      callbacks.forEach((cb) => cb());
    } catch (error: any) {
      console.error('[singleton listener] callback', error);
    }
  }

  let stopListener: (() => void) | undefined;

  /**
   * 添加监听器, 返回取消监听的方法
   * * 初次添加监听器时启动监听
   * * 最后一个监听器取消时停止监听
   */
  const subscribeCallback = (callback: ISingletonCallback) => {
    if (callbacks.size === 0) {
      stopListener = subscribe(onValUpdate);
    }
    callbacks.add(callback);
    return () => {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        stopListener?.();
        stopListener = undefined;
      }
    }
  }

  /**
   * 获取当前值的hook
   */
  const useValue = () => {
    const [value, setValue] = useState(getSnapshot());
    useEffect(() => {
      const updateState = () => {
        setValue((prev) => {
          const next = getSnapshot();
          return app.utils.isDeepEqual(prev, next) ? prev : next;
        });
      };
      // 避免首次渲染时状态已变化
      updateState();
      return subscribeCallback(updateState);
    }, []);
    return value;
  }

  return {
    /**
     * 获取当前值的hook
     * * 需要在组件中使用, 否则无法触发更新
     */
    useValue,
    /**
     * 获取当前值, alias for getSnapshot
     */
    get: getSnapshot,
    /**
     * 订阅更新
     * * 返回取消订阅的方法
     */
    subscribe: subscribeCallback,
  };
}
