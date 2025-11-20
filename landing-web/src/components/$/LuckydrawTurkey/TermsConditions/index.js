/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { CON_CONFIG } from '../config';
import styles from './style.less';

const TermsConditions = ({ namespace = 'luckydrawTurkey' }) => {
  const content = CON_CONFIG[namespace];
  return (
    <div className={styles.conditions} inspector="conditions">
      <div className={styles.inner}>
        <h2 className={styles.title}>{content.title}</h2>
        <div className={styles.content}>
          {content.conditions.map((item, index) => (
            <p className={styles.contentItems} key={`conditions_${index}`}>
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
