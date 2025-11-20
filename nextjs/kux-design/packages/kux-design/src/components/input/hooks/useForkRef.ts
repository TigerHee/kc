import { setRef } from '@/common/setRef';
import { useMemo } from 'react';
import type { Ref } from 'react';

export function useForkRef<T>(refA: Ref<T> | null, refB: React.Ref<T> | null) {
  return useMemo(() => {
    if (refA == null && refB == null) return null;
    return (refValue: T | null) => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}
