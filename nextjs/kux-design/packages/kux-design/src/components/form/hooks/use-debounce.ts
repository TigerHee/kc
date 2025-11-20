/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export default function useDebounce<T>(value: T[]): T[] {
  const [cacheValue, setCacheValue] = React.useState<T[]>(value);
  
  React.useEffect(() => {
    const timeout = setTimeout(
      () => {
        setCacheValue(value);
      },
      value.length ? 0 : 10,
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  return cacheValue;
} 