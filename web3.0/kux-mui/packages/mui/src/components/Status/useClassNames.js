/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';
import { capitalize } from 'utils/index';

function getEmptyClassName(slot) {
  return generateClassName('KuxStatus', slot);
}

export default function useClassNames(state) {
  const { theme } = state;
  const slots = {
    img: ['img', `theme${capitalize(theme)}`],
  };

  return composeClassNames(slots, getEmptyClassName);
}
