/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

function useLayoutState(defaultState) {
  const stateRef = React.useRef(defaultState);
  const [, forceUpdate] = React.useState({});

  const lastPromiseRef = React.useRef(null);
  const updateBatchRef = React.useRef([]);

  function setFrameState(updater) {
    updateBatchRef.current.push(updater);

    const promise = Promise.resolve();
    lastPromiseRef.current = promise;

    promise.then(() => {
      if (lastPromiseRef.current === promise) {
        const prevBatch = updateBatchRef.current;
        const prevState = stateRef.current;
        updateBatchRef.current = [];

        prevBatch.forEach((batchUpdater) => {
          stateRef.current = batchUpdater(stateRef.current);
        });

        lastPromiseRef.current = null;

        if (prevState !== stateRef.current) {
          forceUpdate({});
        }
      }
    });
  }

  React.useEffect(
    () => () => {
      lastPromiseRef.current = null;
    },
    [],
  );

  return [stateRef.current, setFrameState];
}

export default useLayoutState;
