/**
 * Owner: larvide.peng@kupotech.com
 */
import { useState, useEffect } from 'react';

interface ICountUpProps {
  /** 开始计数的数字 */
  start?: number;
  /** 终值 */
  end: number;
  /**
   * 动画时长, 单位为毫秒
   * @default 0
   * @description 0表示不进行动画, 直接显示终值
   */
  duration?: number;
  /**
   * 计数过程小数保留位数，不传时按照终值的小数位数显示 
   */
  decimals?: number;
  /**
   * 动画结束的回调
   */
  onFinish?: () => void;
}

const CountUp = (props: ICountUpProps) => {
  const { start = 0, end, duration = 0, decimals, onFinish } = props;
  const [count, setCount] = useState<number>(duration ? start : end);

  function getDecimals(num: number): number {
    const numStr = num.toString();
    const [, decimal] = numStr.split('.');
    if (decimal) {
      return decimal.length;
    }
    return 0;
  }

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    if(duration === 0 || start === end) {
      setCount(end);
      return;
    }

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentValue = start + progress * (end - start);
      setCount(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        onFinish?.();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [start, end, duration, decimals, onFinish]);

  return (
    <span className="kux-statistic-value">
      {app.formatNumber(count, {
        maximumFractionDigits: !app.is(decimals, 'nullable') ? decimals : getDecimals(end),
      })}
    </span>
  );
};

export default CountUp;
