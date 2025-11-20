
import moment from 'moment';

// 原生实现 range 函数，替代 lodash-es/range
const range = (start: number, end: number): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export const fullHours = range(0, 24);
export const fullMinutes = range(0, 60);
export const fullSeconds = range(0, 60);
export const formatPad = (time: number) => String(time).padStart(2, '0');

// 修复 subtract 函数，使用更明确的类型
export const subtract = (num: number, type: moment.DurationInputArg2) => moment().subtract(num, type);
export const current = () => moment();

export const extraActionMap = [
  { code: 'today', label: 'Today', index: 0, range: [current(), current()] },
  { code: '1week', label: '1 Week', index: 1, range: [subtract(7, 'days'), current()] },
  { code: '1month', label: '1 Month', index: 2, range: [subtract(1, 'months'), current()] },
  // { code: '3month', label: '3 Month', index: 3, range: [subtract(3, 'months'), current()] },
];
