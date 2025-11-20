/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';
import capitalize from 'utils/capitalize';

export default function useClassNames(state) {
  const { variant, fullWidth, size, type, disabled, loading } = state;

  const slots = {
    root: [
      'root',
      variant,
      `${variant}${capitalize(type)}`,
      `size${capitalize(size)}`,
      `${variant}Size${capitalize(size)}`,
      fullWidth && 'fullWidth',
      disabled && 'disabled',
      loading && 'loading',
    ],
    startIcon: ['startIcon', `iconSize${capitalize(size)}`],
    endIcon: ['endIcon', `iconSize${capitalize(size)}`],
  };
  return composeClassNames(slots, (slot) => generateClassName('KuxButton', slot));
}
