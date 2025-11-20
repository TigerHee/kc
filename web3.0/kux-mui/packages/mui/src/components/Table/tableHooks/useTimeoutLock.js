/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export default function useTimeoutLock(defaultState) {
  const frameRef = React.useRef(defaultState || null);
  const timeoutRef = React.useRef();

  function cleanUp() {
    window.clearTimeout(timeoutRef.current);
  }

  function setState(newState) {
    frameRef.current = newState;
    cleanUp();

    timeoutRef.current = window.setTimeout(() => {
      frameRef.current = null;
      timeoutRef.current = undefined;
    }, 100);
  }

  function getState() {
    return frameRef.current;
  }

  React.useEffect(() => cleanUp, []);

  return [setState, getState];
}
