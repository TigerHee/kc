/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-14 17:14:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-18 20:54:42
 * @FilePath: /trade-web/src/trade4.0/hooks/common/useMemoizedFn.js
 * @Description:
 */
import { useMemo, useRef } from 'react';

function useMemoizedFn(fn) {
  const fnRef = useRef(fn);

  fnRef.current = useMemo(() => fn, [fn]);

  const memoizedFn = useRef();
  if (!memoizedFn.current) {
    memoizedFn.current = (...args) => {
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current;
}

export default useMemoizedFn;
