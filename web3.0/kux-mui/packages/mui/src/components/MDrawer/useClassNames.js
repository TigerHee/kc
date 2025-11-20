/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';
import { capitalize } from 'utils/index';

function getDrawerClassName(slot) {
  return generateClassName('KuxMDrawer', slot);
}

export default function useClassNames(state) {
  const { anchor, show } = state;

  const slots = {
    root: ['root', `anchor${capitalize(anchor)}`, show && 'show'],
    mask: ['mask'],
  };
  return composeClassNames(slots, getDrawerClassName);
};
