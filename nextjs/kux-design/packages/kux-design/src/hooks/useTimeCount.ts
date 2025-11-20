import { useEffect, useState } from 'react';

export type IDate = Date | number | string;

export interface IUseCountDownProps {
  /**
   * 时间点，需是一个未来的时间戳, 若小于当前时间则会立即触发 onEnd
   */
  timePoint: number;

  /**
   * 倒计时结束回调
   */
  onEnd?: (() => void) | undefined;
}

/**
 * 计算一个时间差值，并将其向上取整为最接近的秒数
 * @param time 时间戳
 * @returns 
 */
const roundUpLeftDuration = (time: number) => {
  return Math.ceil(Math.max(time - app.now(), 0) / 1000) * 1000;
}

/** 
 * 传一个时间戳进来，获取与当前时间的偏差。使用场景：
 * - 倒计时组件需要精确到秒。
 * - 定时任务需要在整秒触发。
 * @param timeRest 
 * @returns 
 */
export const useTimeCount = (props: IUseCountDownProps) => {
  const { timePoint, onEnd } = props
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const nextTime = roundUpLeftDuration(timePoint);
    setTimeLeft(Math.max(nextTime, 0));
    if (nextTime <= 0) {
      onEnd?.();
      return;
    }
    const intervalId = setInterval(() => {
      const next = roundUpLeftDuration(timePoint);
      setTimeLeft(Math.max(next, 0))
      if (next <= 0) {
        // 异步触发, 避免影响渲染
        setTimeout(() => {
          onEnd?.();
        });
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [onEnd, props, timePoint]);

  return formatTimeRange(timeLeft);
};

export const ensureTimeType = (time: IDate): Date => {
  const date = new Date(time);
  if (app.is(date.getTime(), 'NaN')) {
    throw new Error('invalid date');
  }
  return date;
};

// 时间进制: 60s 60m 24h
const TIME_BASES = [60, 60, 24];
const TIME_UNITS = ['S', 'M', 'H', 'D'];
export type TTimeUnit = 'S' | 'M' | 'H' | 'D';

/**
 * 格式化时间范围
 * 
 * @returns [天, 时, 分, 秒], 天为0时不显示
 */
function formatTimeRange(time: number) {
  let restTime = Math.max(time, 0) / 1000;
  const ranges: number[] = [];
  const unit: TTimeUnit[] = [];
  restTime = TIME_BASES.reduce((prev, base, index) => {
    ranges.push(prev % base);
    unit.push(TIME_UNITS[index] as TTimeUnit)
    return Math.floor(prev / base);
  }, Math.floor(restTime));
  // 剩余的为天数
  if (restTime > 0) {
    ranges.push(restTime);
    unit.push('D')
  }
  
  return {
    timeParts: ranges.reverse().map((piece) => piece > 9 ? `${piece}` : `0${piece}`),
    timeUnit: unit.reverse(),
  };
}
