/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';

function getAlertClassName(slot) {
  return generateClassName('KuxAlert', slot);
}

export default function useClassNames(state) {
  const { type } = state;

  const slots = {
    root: ['root', type],
    icon: ['icon'],
    content: ['content'],
    title: ['title'],
    description: ['description'],
    action: ['action'],
  };

  return composeClassNames(slots, getAlertClassName);
}
