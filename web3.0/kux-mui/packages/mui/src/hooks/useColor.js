/**
 * Owner: victor.ren@kupotech.com
 */
import { useMemo } from 'react';
import * as colors from 'themes/colors';
import useTheme from './useTheme';

export default () => {
  const { currentTheme } = useTheme();
  return useMemo(() => {
    return colors[currentTheme];
  }, [currentTheme]);
};
