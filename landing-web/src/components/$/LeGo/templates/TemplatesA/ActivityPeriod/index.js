/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { get } from 'lodash';
import { ACTIVITY_CONFIG } from '../config';
import styles from './style.less';

const ActivityPeriod = ({ info, currentLang }) => {
  const { config } = useSelector((state) => state.lego);
  const status = get(config, 'activityStatus', 1);
  const startTime = get(config, 'startTime', '');
  const endTime = get(config, 'endTime', '');

  const textConfig = ACTIVITY_CONFIG;
  const title = textConfig.status[status];
  const timeText = textConfig.time(startTime, endTime, currentLang);

  return (
    <div className={styles.container}>
      <h3 className={styles.title} data-activity-title>
        {title}
      </h3>
      <h4 className={styles.time} data-activity-time>
        {timeText}
      </h4>
      <p className={styles.info} data-activity-info>
        {info}
      </p>
      <div className={styles.period}>
        <div className={styles.periodLine} />
        <div className={styles.periodBlock} />
      </div>
    </div>
  );
};

export default React.memo(ActivityPeriod);
