/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { PART_CONFIG } from '../config';
import styles from './style.less';

const Participate = ({ namespace = 'luckydraw' }) => {
  const config = PART_CONFIG[namespace];
  return (
    <div className={styles.conditions} inspector="participate">
      <div className={styles.inner}>
        <h2 className={styles.title}>{config.title}</h2>
        <div className={styles.content}>
          {config.content.map((item, index) => (
            <p className={styles.contentItems} key={`participate_${index}`}>
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Participate;
