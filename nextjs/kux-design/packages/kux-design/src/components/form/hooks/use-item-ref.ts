/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { composeRef } from '../utils/ref-utils';
import { FormContext } from '../context/form-context';

export default function useItemRef() {
  const { itemRef } = React.useContext(FormContext);
  const cacheRef = React.useRef<{
    name: string;
    originRef: any;
    ref: any;
  }>({ name: '', originRef: null, ref: null });

  function getRef(name: string[], children: React.ReactElement) {
    const childrenRef = children && typeof children === 'object' && (children as any).ref;
    const nameStr = name.join('_');
    
    if (cacheRef.current.name !== nameStr || cacheRef.current.originRef !== childrenRef) {
      cacheRef.current.name = nameStr;
      cacheRef.current.originRef = childrenRef;
      cacheRef.current.ref = composeRef(itemRef ? itemRef(name) : () => {}, childrenRef);
    }

    return cacheRef.current.ref;
  }

  return getRef;
} 