/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';
import { capitalize } from 'utils/index';

export default function useClassNames(state) {
  const {
    variant,
    size,
  } = state;

  const slots = {
    root: [
      'root',
      variant,
      size && `size${capitalize(size)}`,
    ],
  };
  return composeClassNames(slots, (slot) => generateClassName('KuxTypography', slot));
};