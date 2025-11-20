/**
 * Owner: victor.ren@kupotech.com
 */
import { useMemo } from 'react';
import { creatShadows } from 'themes/index';

const shadow = creatShadows();
export default () => {
  return useMemo(() => {
    return shadow;
  }, []);
};
