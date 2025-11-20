/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';

export default function useClassNames(state) {
  const { centeredButton, border } = state;

  const slots = {
    root: ['root', border && 'bordered'],
    btnWrapper: ['buttonWrapper', centeredButton && 'centeredButton'],
  };
  return composeClassNames(slots, (slot) => generateClassName('KuxModalFooter', slot));
};