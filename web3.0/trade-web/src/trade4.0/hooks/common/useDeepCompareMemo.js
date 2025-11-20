/*
 * @owner: borden@kupotech.com
 */
import { useRef, useMemo } from 'react';
import { isEqual } from 'lodash';

function useDeepCompare(value) {
  const ref = useRef();

  if (!isEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}

export default function useDeepCompareMemo(fn, deps) {
  const deepDeps = useDeepCompare(deps);

  return useMemo(fn, deepDeps);
}
