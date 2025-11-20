/**
 * Owner: victor.ren@kupotech.com
 */
import getTargetElement from 'utils/domTarget';
import useEffectWithTarget from './useEffectWithTarget';
import useLatest from './useLatest';

export default function useClickListenAway(onClickAway, target, eventName = 'click') {
  const onClickAwayRef = useLatest(onClickAway);

  useEffectWithTarget(
    () => {
      const handler = (event) => {
        const targets = Array.isArray(target) ? target : [target];
        if (
          targets.some((item) => {
            const targetElement = getTargetElement(item);
            return !targetElement || targetElement?.contains(event.target);
          })
        ) {
          return;
        }
        onClickAwayRef.current(event);
      };

      const eventNames = Array.isArray(eventName) ? eventName : [eventName];

      eventNames.forEach((event) => document.addEventListener(event, handler));

      return () => {
        eventNames.forEach((event) => document.removeEventListener(event, handler));
      };
    },
    Array.isArray(eventName) ? eventName : [eventName],
    target,
  );
}
