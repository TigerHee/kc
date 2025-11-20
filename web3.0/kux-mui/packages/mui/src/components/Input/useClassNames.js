/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';
import capitalize from 'utils/capitalize';

function getInputClassName(slot) {
  return generateClassName('KuxInput', slot);
}

export default function useClassNames(state) {
  const { size, disabled, error, type, isFocus } = state;
  const slots = {
    root: [
      'root',
      size && `size${capitalize(size)}`,
      disabled && 'disabled',
      error && `error`,
      type && `type${capitalize(type)}`,
      isFocus && `focus`
    ].filter(Boolean),
    input: ['input'],
    label: ['label'],
    clearIcon: ['clearIcon'],
    togglePwdIcon: ['togglePwdIcon'],
    addonBefore: ['addonBefore'],
    addonAfter: ['addonAfter'],
    prefix: ['prefix'],
    suffix: ['suffix'],
    suffixWrapper: ['suffixWrapper'],
  };
  return composeClassNames(slots, getInputClassName);
};