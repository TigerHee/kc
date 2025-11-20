/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';

function getDialogClassName(slot) {
  return generateClassName('KuxDialog', slot);
}

export default function useClassNames(state) {
  const { classNames: classNamesFromProps, size } = state;

  const slots = {
    root: ['root', size && size],
    mask: ['mask'],
    body: ['body', size && size],
    content: ['content'],
  };

  return composeClassNames(slots, getDialogClassName, classNamesFromProps);
};
