/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';
import capitalize from 'utils/capitalize';

export default function useClassNames(state = {}) {
  const { size, disabled, loading, error } = state;

  const slots = {
    root: [
      'root',
      `size${capitalize(size)}`,
      disabled && 'disabled',
      loading && 'loading',
      error && 'error',
    ],
    wrapper: ['wrapper'],
    icon: ['icon'],
    dropdownIcon: ['dropdownIcon'],
  };
  return composeClassNames(slots, (slot) => generateClassName('KuxSelect', slot));
}

export const useSingleSelectorClassNames = () => {
  const slots = {
    placeholder: ['placeholder'],
    searchPlaceholder: ['searchPlaceholder'],
    searchIcon: ['searchIcon'],
    inputContainer: ['inputContainer'],
    input: ['input'],
  };
  return composeClassNames(slots, (slot) => generateClassName('KuxSelect', slot));
};

export const usePanelClassNames = () => {
  const slots = {
    panelContainer: ['panelContainer'],
    option: ['optionItem'],
    itemLabel: ['itemLabel'],
    itemIcon: ['itemIcon'],
  };
  return composeClassNames(slots, (slot) => generateClassName('KuxSelect', slot));
};
