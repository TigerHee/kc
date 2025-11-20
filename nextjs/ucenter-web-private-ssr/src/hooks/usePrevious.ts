/**
 * Owner: willen@kupotech.com
 */
import { useRef, useEffect } from 'react';

export default (value) => {
  const ref = useRef<{ pathname: string } | undefined>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
