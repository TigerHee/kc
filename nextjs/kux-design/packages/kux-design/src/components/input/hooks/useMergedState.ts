import { useState, useRef, useCallback, useEffect } from 'react';

type Updater<T> = (updater: T | ((origin: T) => T), ignoreDestroy?: boolean) => void;

export function useMergedState<T, R = T>(
  defaultStateValue: T | (() => T),
  option?: {
    defaultValue?: T | (() => T);
    value?: T;
    onChange?: (value: T, prevValue: T) => void;
    postState?: (value: T) => T;
  },
): [R, Updater<T>] {
  const { defaultValue, value, onChange, postState } = option || {};
  const [innerValue, setInnerValue] = useState(() => {
    if (value !== undefined) {
      return value;
    }
    if (defaultValue !== undefined) {
      return typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue;
    }
    return typeof defaultStateValue === 'function'
      ? (defaultStateValue as () => T)()
      : defaultStateValue;
  });

  let mergedValue = value !== undefined ? value : innerValue;
  if (postState) {
    mergedValue = postState(mergedValue);
  }

  // setState
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const triggerChange: Updater<T> = useCallback(
    (newValue, _ignoreDestroy) => {
      const value =
        typeof newValue === 'function' ? (newValue as (origin: T) => T)(mergedValue) : newValue;

      setInnerValue(value);
      if (mergedValue !== value && onChangeRef.current) {
        onChangeRef.current(value, mergedValue);
      }
    },
    [mergedValue, onChangeRef],
  ) as Updater<T>;

  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (value !== undefined) {
      setInnerValue(value);
    }
  }, [value]);

  return [mergedValue as unknown as R, triggerChange];
}
