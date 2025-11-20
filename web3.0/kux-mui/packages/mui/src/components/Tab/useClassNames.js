/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';
import capitalize from 'utils/capitalize';

function getTabClassName(slot) {
  return generateClassName('KuxTab', slot);
}

export default function useClassNames(state) {
  const { variant, selected } = state;

  const slots = {
    TabItem: ['TabItem', variant && `variant${capitalize(variant)}`, selected && `selected`],
  };
  return composeClassNames(slots, getTabClassName);
}