/**
 * Owner: victor.ren@kupotech.com
 */
import { useMemo } from 'react';
import { createZIndices } from 'themes/index';

const zIndices = createZIndices();

export default () => {
  return useMemo(() => {
    return zIndices;
  }, []);
};
