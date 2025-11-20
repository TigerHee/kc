/**
 * Owner: victor.ren@kupotech.com
 */
import capitalize from 'utils/capitalize';

export const DEFAULTS = {
  maxSnack: 3,
  hideIcon: true,
  variant: 'success',
  autoHideDuration: 3000,
  position: {
    vertical: 'top',
    horizontal: 'center',
  },
};

export const zIndex = 9999;

export const transitionDuration = {
  enter: 225,
  exit: 195,
};

export const positionDistance = {
  verticalDistance: 60,
  horizontalDistance: 20,
};

export const isDefined = (value) => !!value || value === 0;

export const originKeyExtractor = (position) =>
  `${capitalize(position.vertical)}${capitalize(position.horizontal)}`;

const DIRECTION = {
  right: 'left',
  left: 'right',
  bottom: 'up',
  top: 'down',
};

export const getTransitionDirection = (position) => {
  if (position.horizontal !== 'center') {
    return DIRECTION[position.horizontal];
  }
  return DIRECTION[position.vertical];
};

const numberOrNull = (numberish) => typeof numberish === 'number' || numberish === null;

export const merge = (options, props, defaults) => (name) => {
  if (name === 'autoHideDuration') {
    if (numberOrNull(options.autoHideDuration)) return options.autoHideDuration;
    if (numberOrNull(props.autoHideDuration)) return props.autoHideDuration;
    return DEFAULTS.autoHideDuration;
  }

  return options[name] || props[name] || defaults[name];
};
