/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { STATE_TEXT_CONFIG, TIME_TEXT_CONFIG } from '../config';
import styles from './style.less';

const ActivityPeriod = ({ namespace = 'luckydrawSepa' }) => {
  const { status = 'NOT_START', startTime = '', endTime = '' } = useSelector(
    state => state[namespace].config,
  );
  const title = STATE_TEXT_CONFIG[namespace][status];
  const timeText = TIME_TEXT_CONFIG[namespace](startTime, endTime);

  return (
    <div className={styles.container} inspector="period">
      <h3 className={styles.title}>{title}</h3>
      <h4 className={styles.time}>{timeText}</h4>
      <div className={styles.period}>
        <div className={styles.periodLine} />
        <div className={styles.periodBlock} />
      </div>
    </div>
  );
};

export default ActivityPeriod;
