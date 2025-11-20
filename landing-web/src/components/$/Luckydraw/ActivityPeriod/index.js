/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { STATE_TEXT_CONFIG, TIME_TEXT_CONFIG, INTRO_TEXT_CONFIG } from '../config';
import styles from './style.less';
import PeriodImg from 'assets/luckydrawTurkey/period.png';

const ActivityPeriod = ({ namespace = 'luckydraw' }) => {
  const { status, startTime, endTime } = useSelector(state => state[namespace].config);
  const title = STATE_TEXT_CONFIG[namespace][status];
  const timeText = TIME_TEXT_CONFIG[namespace](startTime, endTime);
  const introText = INTRO_TEXT_CONFIG[namespace](startTime, endTime);

  return (
    <div className={styles.container} inspector="period">
      <h3 className={styles.title}>{title}</h3>
      <h4 className={styles.time}>{timeText}</h4>
      <p className={styles.intro} dangerouslySetInnerHTML={{ __html: introText }} />
      <img className={styles.periodImg} src={PeriodImg} alt="period" />
    </div>
  );
};

export default ActivityPeriod;
