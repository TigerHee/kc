/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';

function getBoxClassName(slot) {
  return generateClassName('KuxBox', slot);
}

export default function useClassNames() {
  const slots = {
    root: ['root'],
  };
  return composeClassNames(slots, getBoxClassName);
};
