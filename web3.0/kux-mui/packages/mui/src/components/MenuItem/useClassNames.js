/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';
import { capitalize } from 'utils/index';

function getDrawerClassName(slot) {
  return generateClassName('KuxMenuItem', slot);
}

export default function useClassNames(state) {
  const { isSelected, size } = state;
  const slots = {
    root: ['root', size && `size${capitalize(size)}`, isSelected && 'selected'],
    icon: ['icon'],
    text: ['text'],
  };
  return composeClassNames(slots, getDrawerClassName);
};

