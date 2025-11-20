/**
 * Owner: victor.ren@kupotech.com
 */
import * as React from 'react';
import { composeRef } from 'utils';
import { KuFoxFormContext } from '../aux';

export default function useItemRef() {
  const { itemRef } = React.useContext(KuFoxFormContext);
  const cacheRef = React.useRef({});

  function getRef(name, children) {
    const childrenRef = children && typeof children === 'object' && children.ref;
    const nameStr = name.join('_');
    if (cacheRef.current.name !== nameStr || cacheRef.current.originRef !== childrenRef) {
      cacheRef.current.name = nameStr;
      cacheRef.current.originRef = childrenRef;
      cacheRef.current.ref = composeRef(itemRef(name), childrenRef);
    }

    return cacheRef.current.ref;
  }

  return getRef;
}
