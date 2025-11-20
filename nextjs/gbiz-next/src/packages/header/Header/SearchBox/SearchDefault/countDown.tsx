/**
 * Owner: roger@kupotech.com
 */
import React, { useEffect, useMemo, useState } from 'react';
import { padStart } from 'lodash-es';
import useInterval from '../../../hookTool/useInterval';
import { getTimeData } from '../config';
import styles from './styles.module.scss';
interface CountDownProps {
  initialSec?: number;
  finishFn?: () => void;
}

export default ({ initialSec = 0, finishFn = () => null }: CountDownProps) => {
  const delay = 1000;
  const [times, setTimes] = useState(0);
  const clear = useInterval(() => {
    if (times > 0) {
      setTimes(times - 1);
    } else {
      finishFn();
      clear();
    }
  }, delay);

  const timeStrs = useMemo(() => {
    const temps = getTimeData(times);
    return temps.map(temp => {
      return padStart(temp, 2, '0');
    });
  }, [times]);

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  useEffect(() => {
    let number = Number(initialSec) || 0;
    number = Math.ceil(number / 1000);
    setTimes(number && number > 0 ? number : 0);
  }, [initialSec]);
  return (
    <div className={styles.countDownWrapper}>
      <div className={styles.countDownItem}>{timeStrs[0]}</div>
      <span className={styles.countDownDivider}>:</span>
      <div className={styles.countDownItem}>{timeStrs[1]}</div>
      <span className={styles.countDownDivider}>:</span>
      <div className={styles.countDownItem}>{timeStrs[2]}</div>
    </div>
  );
};
