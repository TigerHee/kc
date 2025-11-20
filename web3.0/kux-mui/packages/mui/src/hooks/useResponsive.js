/**
 * Owner: victor.ren@kupotech.com
 */
import { useCallback, useState, useContext } from 'react';
import { throttle, isEqual } from 'lodash-es';
import { BreakpointsContext } from 'context/index';
import useEnhancedEffect from './useEnhancedEffect';

function calculate({ breakpoints }) {
  const width = window.innerWidth;
  const keys = Object.keys(breakpoints);
  const _breakpoints = {};
  // forEach is too low
  for (let i = 0; i < keys.length; i++) {
    _breakpoints[keys[i]] = width >= breakpoints[keys[i]];
  }
  return _breakpoints;
}

export function useResponsive() {
  const { breakpoints } = useContext(BreakpointsContext);
  const initialWidth = calculate({ breakpoints });
  const [state, setState] = useState(initialWidth);

  const handler = useCallback(
    throttle(() => {
      const calc = calculate({ breakpoints });
      setState((v) => (isEqual(v, calc) ? v : calc));
    }, 300),
    [breakpoints],
  );

  useEnhancedEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('resize', handler);
    handler();
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, [handler]);

  return state;
}

export default useResponsive;
