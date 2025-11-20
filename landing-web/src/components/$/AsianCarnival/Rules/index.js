/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { RULES_CONFIG } from '../config';
import styles from './style.less';

const Rules = ({ namespace = 'asianCarnival' }) => {
  const config = RULES_CONFIG[namespace];
  return (
    <div className={styles.conditions} inspector="rules">
      <div className={styles.inner}>
        <h2 className={styles.title}>{config.title}</h2>
        <div className={styles.content}>
          {config.content.map((item, index) => (
            <p className={styles.contentItems} key={`rules_${index}`}>
              <span>{index + 1}</span>.<span>{item}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rules;
