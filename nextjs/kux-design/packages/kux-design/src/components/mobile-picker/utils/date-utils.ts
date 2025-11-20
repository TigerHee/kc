import { Moment } from 'moment';

// 格式化数字，补零
export function formatPad(num: number): string {
  return String(num).padStart(2, '0');
}

// 排序日期数组
export function sortDate(dateArray: Moment[]): Moment[] {
  if (!dateArray.length || dateArray.length !== 2) return dateArray;
  const _dateArray = [...dateArray];
  return _dateArray.sort((a, b) => a.valueOf() - b.valueOf());
}

// 获取日期数组的显示文本
export function getDateDisplayText(dates: Moment[], format: string): string[] {
  return dates.map(date => date.format(format));
} 

