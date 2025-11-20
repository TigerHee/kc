/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';

function getDividerClassName(slot) {
  return generateClassName('KuxDivider', slot);
}

export default function useClassNames(state) {
  const { orientation, type } = state;
  const slots = {
    root: ['root', orientation && orientation, type && type],
    text: ['text'],
  };
  return composeClassNames(slots, getDividerClassName);
};