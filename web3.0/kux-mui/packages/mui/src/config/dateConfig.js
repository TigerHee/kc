import { current, subtract } from 'utils/dateUtils';

export const extraActionMap = [
  { code: 'today', label: 'Today', index: 0, range: [current(), current()] },
  { code: '1week', label: '1 Week', index: 1, range: [subtract(7, 'days'), current()] },
  { code: '1month', label: '1 Month', index: 2, range: [subtract(1, 'months'), current()] },
  { code: '3month', label: '3 Month', index: 3, range: [subtract(3, 'months'), current()] },
];
