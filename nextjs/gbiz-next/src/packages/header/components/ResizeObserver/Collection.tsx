/**
 * Owner: victor.ren@kupotech.com
 */
// @ts-nocheck
import React from 'react';

export const CollectionContext = React.createContext(null);

export function Collection({ children, onBatchResize }) {
  const resizeIdRef = React.useRef(0);
  const resizeInfosRef = React.useRef([]);

  const onCollectionResize = React.useContext(CollectionContext);

  const onResize = React.useCallback(
    (size, element, data) => {
      resizeIdRef.current += 1;
      const currentId = resizeIdRef.current;

      resizeInfosRef.current.push({
        size,
        element,
        data,
      });

      Promise.resolve().then(() => {
        if (currentId === resizeIdRef.current) {
          onBatchResize?.(resizeInfosRef.current);
          resizeInfosRef.current = [];
        }
      });

      onCollectionResize?.(size, element, data);
    },
    [onBatchResize, onCollectionResize],
  );

  return <CollectionContext.Provider value={onResize}>{children}</CollectionContext.Provider>;
}
