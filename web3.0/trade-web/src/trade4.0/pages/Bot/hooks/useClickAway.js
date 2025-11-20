/**
 * Owner: mike@kupotech.com
 */
import { useEffect, useRef } from 'react';

export function getTargetElement(target, defaultElement) {
  if (!target) {
    return defaultElement;
  }

  let targetElement;

  if (typeof target === 'function') {
    targetElement = target();
  } else if ('current' in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
}

export default function useClickAway(onClickAway, target, eventName = 'click', switchOn = true) {
  const onClickAwayRef = useRef(onClickAway);
  onClickAwayRef.current = onClickAway;

  useEffect(() => {
    const handler = event => {
      const targets = Array.isArray(target) ? target : [target];
      if (
        targets.some(targetItem => {
          const targetElement = getTargetElement(targetItem);
          return !targetElement || targetElement?.contains(event.target);
        })
      ) {
        return;
      }
      onClickAwayRef.current(event);
    };

    switchOn && document.addEventListener(eventName, handler);

    return () => {
      document.removeEventListener(eventName, handler);
    };
  }, [target, eventName, switchOn]);
}
