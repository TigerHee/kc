/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';
import capitalize from 'utils/capitalize';

export default function useClassNames({ size, disabled, error }) {
  const slots = {
    root: ['wrapper', `size${capitalize(size)}`, disabled && 'disabled', error && 'error'],
  };
  return composeClassNames(slots, (slot) => generateClassName('KuxRangePicker', slot));
}
