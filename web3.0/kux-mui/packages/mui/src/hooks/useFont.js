/**
 * Owner: victor.ren@kupotech.com
 */
import { useMemo } from 'react';
import { fonts } from 'themes/index';

export default () => {
  return useMemo(() => {
    return fonts;
  }, []);
};
