/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';

export default function useClassNames(state) {
  const { disableClose, border } = state;

  const slots = {
    root: ['root', border && 'bordered'],
    back: ['back', disableClose && 'disabledClose'],
    title: ['title'],
    close: ['close', disableClose && 'disabledClose'],
  };
  return composeClassNames(slots, (slot) => generateClassName('KuxModalHeader', slot));
};