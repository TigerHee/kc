/**
 * Owner: victor.ren@kupotech.com
 */
import { useCallback, useState, useEffect } from 'react';

export function useMergedState<T>(
  defaultStateValue: T | (() => T),
  option?: {
    value?: T;
    onChange?: (value: T) => void;
  }
): [T, (value: T) => void] {
  const { value, onChange } = option || {};
  
  const [innerValue, setInnerValue] = useState<T>(() => {
    if (value !== undefined) {
      return value;
    }
    if (typeof defaultStateValue === 'function') {
      return (defaultStateValue as () => T)();
    }
    return defaultStateValue;
  });

  const mergedValue = value !== undefined ? value : innerValue;

  const triggerChange = useCallback((newValue: T) => {
    setInnerValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value);
    }
  }, [value]);

  return [mergedValue, triggerChange];
} 