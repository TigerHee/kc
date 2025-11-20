/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';
import capitalize from 'utils/capitalize';

function getTooltipClassName(slot) {
  return generateClassName('KuxTooltip', slot);
}

export default function useClassClassNames({ placement }) {
  const slots = {
    root: ['root', `placement${capitalize(placement)}`],
    title: ['title'],
    arrow: ['arrow'],
    popper: ['popper'],
  };
  return composeClassNames(slots, getTooltipClassName);
}
