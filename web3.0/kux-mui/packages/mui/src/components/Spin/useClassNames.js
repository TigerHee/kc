import { generateClassName, composeClassNames } from 'styles/index';
import { capitalize } from 'utils/index';

function getSpinClassName(slot) {
  return generateClassName('KuxSpin', slot);
}

export default function useClassNames(state) {
  const { size, theme } = state;
  const slots = {
    root: ['root', `${size}Spin`, `theme${capitalize(theme)}`],
    wrapper: ['wrapper'],
    container: ['container'],
    circle: ['circle'],
    logo: ['logo'],
    normalLoading: ['normalLoading'],
  };

  return composeClassNames(slots, getSpinClassName);
}
