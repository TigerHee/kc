/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect, useState } from 'react';
import { Event } from 'helper';

export default () => {
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    const supportOrientation =
      typeof window.orientation === 'number' && typeof window.onorientationchange === 'object';

    let curDirection = null;
    const updateDirection = () => {
      if (supportOrientation) {
        switch (window.orientation) {
          case 90:
          case -90:
            curDirection = 'landscape';
            break;
          default:
            curDirection = 'portrait';
            break;
        }
      } else {
        curDirection = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
      }
      setDirection(curDirection);
    };

    updateDirection();

    if (supportOrientation) {
      Event.addHandler(window, 'orientationchange', updateDirection);
    } else {
      Event.addHandler(window, 'resize', updateDirection);
    }

    return () => {
      if (supportOrientation) {
        Event.removeHandler(window, 'orientationchange', updateDirection);
      } else {
        Event.removeHandler(window, 'resize', updateDirection);
      }
    };
  }, []);

  return direction;
};
