/**
 * Owner: sean.shi@kupotech.com
 */
import React from 'react';

// 定义 Ref 类型：可以是函数形式或对象形式
type Ref<T> = React.RefCallback<T> | React.MutableRefObject<T | null> | null | undefined;

export function setRef<T>(ref: Ref<T>, value: T | null): void {
  if (typeof ref === 'function') {
    // 函数形式 ref
    ref(value);
  } else if (ref && typeof ref === 'object') {
    // 对象形式 ref (MutableRefObject)
    ref.current = value;
  }
}

export function useForkRef<T>(
  refA: Ref<T>,
  refB: Ref<T>
): React.RefCallback<T> | null {
  return React.useMemo(() => {
    if (refA == null && refB == null) {
      return null;
    }
    
    return (value: T | null) => {
      setRef(refA, value);
      setRef(refB, value);
    };
  }, [refA, refB]);
}