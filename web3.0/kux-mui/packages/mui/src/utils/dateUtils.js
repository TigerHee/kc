import range from 'lodash-es/range';
import moment from 'moment';

export const fullHours = range(0, 24);
export const fullMinutes = range(0, 60);
export const fullSeconds = range(0, 60);
export const formatPad = (time) => String(time).padStart(2, '0');
export const subtract = (num, type) => moment().subtract(num, type);
export const current = () => moment();

export default {
  fullHours,
  fullMinutes,
  fullSeconds,
  formatPad,
  subtract,
  current,
};
