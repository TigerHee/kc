import { useEffect, useRef } from 'react';
import { isEqual } from 'lodash-es';

// 针对 useStoreValue 这类“通过 Hook 选择切片”的场景
type UseSelectorHook<S> = <U>(selector: (state: S) => U) => U;

export function useDvaSyncHook<S extends object = any>(
  useSelectorHook: UseSelectorHook<S>,
  namespace: string,
  keys: (keyof S | string)[],
  dva?: any
): void {
  // 逐 key 选择，避免 selector 返回新对象导致 useSyncExternalStore 报错
  const values = dva ? keys.map(key => useSelectorHook(state => (state as any)[key as string])) : [];
  const lastRef = useRef<any>({});

  useEffect(() => {
    if (!dva) {
      return;
    }
    const slice: Record<string, any> = {};
    keys.forEach((k, idx) => {
      slice[k as string] = values[idx];
    });
    if (isEqual(slice, lastRef.current)) return;
    const dispatch = dva._store?.dispatch || dva.dispatch;
    if (typeof dispatch === 'function') {
      dispatch({ type: `${namespace}/update`, payload: slice });
    }
    lastRef.current = slice;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, dva, ...values]);
}
