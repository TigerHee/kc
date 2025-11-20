/**
 * Owner: mike@kupotech.com
 */
import { formatNumber } from 'Bot/helper';

export default ({ value, empty = '--', precision }) => {
  return value ? formatNumber(value, precision) : empty;
};
