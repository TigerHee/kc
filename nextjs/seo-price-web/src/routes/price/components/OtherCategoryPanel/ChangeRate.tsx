/**
 * Owner: kevyn.yu@kupotech.com
 */
import { NumberFormat } from '@kux/mui-next';
import { useEffect, useMemo, useState } from 'react';
import { useLang } from 'gbiz-next/hooks';
import styles from './changeRate.module.scss';

const STATUS = {
  UP: 'up',
  DOWN: 'down',
};


const ChangeRate = ({ value, decimal = 2, color, size = 'md', style, ...restProps }: any) => {
  const [status, setStatus] = useState(null);
  const { currentLang } = useLang();

  useEffect(() => {
    if (color) {
      setStatus(null);
      return;
    }
    let status;
    if (0 < +value) {
      status = STATUS.UP;
    } else if (0 > +value) {
      status = STATUS.DOWN;
    }
    setStatus(status);
  }, [value, color]);

  const mergedStyle = useMemo(() => {
    return color
      ? {
          ...style,
          color,
        }
      : style;
  }, [color, style]);

  const calcPerValue =
    (value || +value === 0) && value !== null ? (
      <NumberFormat
        options={{
          style: 'percent',
          minimumFractionDigits: decimal,
          maximumFractionDigits: decimal,
        }}
        lang={currentLang}
        isPositive={+value !== 0}
      >
        {value}
      </NumberFormat>
    ) : (
      '--'
    );

  return (
    <span className={styles.changeRateSpan} data-status={status} data-size={size} style={mergedStyle} {...restProps}>
      {calcPerValue}
    </span>
  );
};

export default ChangeRate;
