/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import setRef from 'utils/setRef';

export default function useForkRef(refA, refB) {
  return React.useMemo(() => {
    if (refA == null && refB == null) {
      return null;
    }

    return (refValue) => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}
