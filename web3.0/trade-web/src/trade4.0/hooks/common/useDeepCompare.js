/*
 * @owner: borden@kupotech.com
 */
import { useRef } from 'react';
import { isEqual } from 'lodash';

export default function useDeepCompare(value) {
  const ref = useRef();

  if (!isEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}
