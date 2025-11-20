/**
 * Owner: victor.ren@kupotech.com
 */
import { useMemo } from 'react';
import { createRadius } from 'themes/index';

const radius = createRadius();

export default () => {
  return useMemo(() => {
    return radius;
  }, []);
};
