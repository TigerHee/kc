/*
 * owner: Clyne@kupotech.com
 */
import { maxSize } from './config';

export const format = (data) => {
  // 最多100条，时间从大到小排序
  return data
    .slice(0, maxSize)
    .sort(({ sequence }, { sequence: t1 }) => Number(t1) - Number(sequence));
};
