/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';
import { capitalize } from 'utils/index';

function getEmptyClassName(slot) {
  return generateClassName('KuxEmpty', slot);
}

export default function useClassNames(state) {
  const { size, theme } = state;
  const slots = {
    root: ['root', size && `size${capitalize(size)}`, `theme${capitalize(theme)}`],
    img: ['img'],
    description: ['description'],
    subDescription: ['subDescription'],
  };

  return composeClassNames(slots, getEmptyClassName);
};

