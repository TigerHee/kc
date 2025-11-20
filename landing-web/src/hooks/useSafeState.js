/**
 * Owner: jesse.shao@kupotech.com
 */
import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * 更安全的 useState 函数
 * 在有些时候我们会在请求接口之后执行 setState 操作
 * 但此时组件有可能已经被销毁导致控制台出现如下报错
 * 所以我们提供一个更加安全的接口来实现这个行为
 *
 * Warning: Can't perform a React state update on an unmounted component.
 * This is a no-op, but it indicates a memory leak in your application.
 * To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
 *
 * @param initialState
 * @returns
 */
const useSafeState = initialState => {
  const mountRef = useRef(false);

  useEffect(() => {
    mountRef.current = true;
    return () => {
      mountRef.current = false;
    };
  }, []);

  const [state, setState] = useState(initialState);

  const setSafeState = useCallback(newState => {
    if (mountRef.current) {
      setState(newState);
    }
  }, []);

  return [state, setSafeState];
};

export default useSafeState;
