/**
 * Owner: sean.shi@kupotech.com
 */
import React from 'react';

export function composeRef<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        (ref as React.MutableRefObject<T>).current = node;
      }
    });
  };
} 