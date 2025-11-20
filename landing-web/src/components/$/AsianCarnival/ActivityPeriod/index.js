/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { map } from 'lodash';
import { STATE_TEXT_CONFIG, TIME_TEXT_CONFIG, INTRO_TEXT_CONFIG } from '../config';
import styles from './style.less';

const ActivityPeriod = ({ namespace = 'asianCarnival' }) => {
  const { status, startTime, endTime } = useSelector(state => state[namespace].config);
  const title = STATE_TEXT_CONFIG[namespace][status];
  const timeText = TIME_TEXT_CONFIG[namespace](startTime, endTime);
  const introText = INTRO_TEXT_CONFIG[namespace];

  return (
    <div className={styles.container}>
      <h3 className={styles.title} inspector="period_title">
        {title}
      </h3>
      <h4 className={styles.time} inspector="period_time">
        {timeText}
      </h4>
      <div className={styles.intro} inspector="period_info">
        {map(introText.activity, (item, index) => {
          return (
            <div className={styles.introItems} key={`intro_${index}`}>
              <p className={styles.introTitle}>{item.title}</p>
              <p className={styles.introContent}>{item.content}</p>
              <div>
                {map(item.info, (el, idx) => {
                  return (
                    <div className={styles.infoItems} key={`intro_info_${idx}`}>
                      <div className={styles.infoIcon} />
                      <p className={styles.infoContent}>{el}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.period}>
        <div className={styles.periodLine} />
        <div className={styles.periodBlock} />
      </div>
    </div>
  );
};

export default ActivityPeriod;
