import {numberFixed} from 'utils/helper';
import {multiply} from 'utils/operation';
export const formatPercent = value => {
  return `${numberFixed(multiply(value)(100), 2)}%`;
};
