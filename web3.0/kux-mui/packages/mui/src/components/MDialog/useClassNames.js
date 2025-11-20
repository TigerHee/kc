/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';

function getDrawerClassName(slot) {
  return generateClassName('KuxMDialog', slot);
}

export default function useClassNames(state) {
  const { show } = state;

  const slots = {
    root: ['root', show && 'show'],
    mask: ['mask'],
    content: ['content'],
    footer: ['footer']
  };
  return composeClassNames(slots, getDrawerClassName);
};
