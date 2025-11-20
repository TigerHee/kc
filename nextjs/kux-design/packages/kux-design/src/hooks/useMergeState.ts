/**
 * Owner: sean.shi@kupotech.com
 *
 */
import { useCallback, useState, useEffect, useRef } from 'react';

export function useMergedState<T>(
  defaultStateValue: T | (() => T),
  option?: {
    defaultValue?: T | (() => T);
    value?: T;
    onChange?: (value: T, mergedValue: T) => void;
    postState?: (value: T) => T;
  },
): [T, (value: T) => void] {
  const { defaultValue, postState, value, onChange } = option || {};

  const [innerValue, setInnerValue] = useState<T>(() => {
    if (value !== undefined) {
      return value;
    }
    if (typeof defaultValue === 'function') {
      return (defaultValue as () => T)();
    }
    if (typeof defaultValue !== 'undefined') {
      return defaultValue;
    }
    if (typeof defaultStateValue === 'function') {
      return (defaultStateValue as () => T)();
    }
    return defaultStateValue;
  });

  let mergedValue = value !== undefined ? value : innerValue;
  if (postState) {
    mergedValue = postState(mergedValue);
  }

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const triggerChange = useCallback(
    (newValue: T) => {
      setInnerValue(newValue);
      if (mergedValue !== newValue && onChangeRef.current) {
        onChangeRef.current(newValue, mergedValue);
      }
    },
    [mergedValue],
  );

  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (typeof value !== 'undefined') {
      setInnerValue(value);
    }
  }, [value]);

  return [mergedValue, triggerChange];
}
