/**
 * Owner: tiger@kupotech.com
 */
import dayjs from 'dayjs';

const preFixNum = (num, length = 2) => {
  return (Array(length).join('0') + num).slice(-length);
};

export const getCountdown = (end) => {
  const endTime = dayjs(end);
  const curTime = dayjs();
  const duration = dayjs.duration(endTime - curTime);
  const isEnd = endTime.diff(curTime) <= 0;

  const minute = isEnd ? '00' : preFixNum(duration.minutes());
  const second = isEnd ? '00' : preFixNum(duration.seconds());
  return { minute, second, isEnd };
};
