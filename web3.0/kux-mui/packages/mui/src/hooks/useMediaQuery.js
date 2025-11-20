/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { useTheme } from '@emotion/react';
import useEnhancedEffect from './useEnhancedEffect';

const noop = () => {};

export default function useMediaQuery(queryInput, options = {}) {
  const [matches, setMatches] = React.useState(null);
  const active = React.useRef(true);
  const theme = useTheme();

  const queryString = React.useMemo(() => {
    const q = typeof queryInput === 'function' ? queryInput(theme) : queryInput;
    return q.replace(/^@media( ?)/m, '');
  }, [queryInput, theme]);

  if (process.env.NODE_ENV !== 'production') {
    if (typeof queryInput === 'function' && theme === null) {
      console.error(
        [
          'KuFoxMui: The `query` argument provided is invalid.',
          'You are providing a function without a theme in the context.',
          'One of the parent elements needs to use a ThemeProvider.',
        ].join('\n'),
      );
    }
  }

  useEnhancedEffect(() => {
    const supportMatchMedia =
      typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined';

    if (!supportMatchMedia) {
      return noop;
    }

    const matchMedia = options.matchMedia || window.matchMedia;
    const queryList = matchMedia(queryString);

    const updateMatches = () => {
      if (active.current) {
        setMatches(queryList.matches);
      }
    };

    updateMatches(queryList.matches);

    queryList.addListener(updateMatches);
    return () => {
      active.current = false;
      queryList.removeListener(updateMatches);
    };
  }, [queryString, matchMedia]);

  if (process.env.NODE_ENV !== 'production') {
    React.useDebugValue({ queryString, matches });
  }

  return matches;
}
