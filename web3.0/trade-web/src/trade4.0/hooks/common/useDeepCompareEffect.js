/*
 * @owner: borden@kupotech.com
 */
import { useEffect } from 'react';
import useDeepCompare from './useDeepCompare';

export default function useDeepCompareEffect(fn, deps) {
  const deepDeps = useDeepCompare(deps);

  return useEffect(fn, deepDeps);
}
