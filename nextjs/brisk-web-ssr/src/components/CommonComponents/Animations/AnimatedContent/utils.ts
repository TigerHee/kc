import { add } from '@/tools/helper';

const DELAY_DURATION = 0;

/**
 * 计算线性动画延时时间，单位秒
 * @param index
 * @param distance
 * @param initDelayTime
 * @returns
 */
export const calculateDelayTime = (index = 0, distance = 0.1, initDelayTime = DELAY_DURATION) => {
  if (index === 0) {
    return initDelayTime;
  }
  const result = add(initDelayTime, index * distance);

  return result.toNumber();
};
