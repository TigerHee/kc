/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { get } from 'lodash';
import { ACTIVITY_CONFIG } from '../config';
import styles from './style.less';

const ActivityPeriod = ({ namespace = 'newCoinCarnival' }) => {
  const { config } = useSelector(state => state[namespace]);
  const status = get(config, 'status', 'NOT_START');
  const startTime = get(config, 'startTime', '');
  const endTime = get(config, 'endTime', '');

  const textConfig = ACTIVITY_CONFIG[namespace];
  const title = textConfig.status[status];
  const timeText = textConfig.time(startTime, endTime);

  return (
    <div className={styles.container} inspector="period">
      <h3 className={styles.title}>{title}</h3>
      <h4 className={styles.time}>{timeText}</h4>
      <p className={styles.info}>{textConfig.info}</p>
      <div className={styles.period}>
        <div className={styles.periodLine} />
        <div className={styles.periodBlock} />
      </div>
    </div>
  );
};

export default ActivityPeriod;
