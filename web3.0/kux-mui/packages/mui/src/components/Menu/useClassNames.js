/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';

function getDrawerClassName(slot) {
  return generateClassName('KuxMenu', slot);
}

export default function useClassNames(state) {
  const slots = {
    root: ['root'],
  };
  return composeClassNames(slots, getDrawerClassName);
}
