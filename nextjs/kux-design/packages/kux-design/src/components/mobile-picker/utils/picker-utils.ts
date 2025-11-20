import moment, { Moment } from 'moment';

// 生成小时数组 (0-23)
export const fullHours = Array.from({ length: 24 }, (_, i) => i);

// 生成分钟数组 (0-59)
export const fullMinutes = Array.from({ length: 60 }, (_, i) => i);

// 生成秒数组 (0-59)
export const fullSeconds = Array.from({ length: 60 }, (_, i) => i);

// 时间选择器列配置
export const timeColumns = [fullHours, fullMinutes, fullSeconds];

// 处理时间值
export function handleTimeValue(date: Moment): [number, number, number] {
  const now = date ? moment(date) : moment();
  return [now.hours(), now.minutes(), now.seconds()];
}

// 处理时间变化
export function handleTimeChange(dateArray: number[]): Moment {
  const now = moment();
  now
    .hour(dateArray[0] || 0)
    .minute(dateArray[1] || 0)
    .second(dateArray[2] || 0);
  return now;
}