/**
 * Owner: tiger@kupotech.com
 * 返回当前最新值的 Hook，可以避免闭包问题。
 */
import { useRef } from 'react';

function useLatest(value) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

export default useLatest;
