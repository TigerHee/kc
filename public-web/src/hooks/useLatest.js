/**
 * Owner: willen@kupotech.com
 */
import { useRef } from 'react';

function useLatest(value) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

export default useLatest;
