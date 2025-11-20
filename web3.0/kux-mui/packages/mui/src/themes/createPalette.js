/**
 * Owner: victor.ren@kupotech.com
 */
import deepmerge from 'utils/deepmerge';
import { light, dark } from './colors';

const modes = {
  light,
  dark,
};

export default (palette) => {
  const { mode = 'light', ...others } = palette;
  return deepmerge(
    {
      mode,
      ...modes[mode],
    },
    others,
  );
};
