/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import classnames from 'classnames';
import { RULES_CONFIG } from '../config';
import styles from './style.less';

const Rules = ({ namespace = 'luckydrawSepa' }) => {
  const config = RULES_CONFIG[namespace];
  const { isInApp } = useSelector(state => state.app);
  return (
    <div className={styles.conditions} inspector="conditions">
      <div className={styles.inner}>
        <h2 className={styles.title}>{config.title}</h2>
        <div className={styles.content}>
          {config.content.map((item, index) => (
            <p
              className={classnames(styles.contentItems, { [styles.noClick]: isInApp })}
              key={`rules_${index}`}
            >
              <span>{index + 1}</span>.<span>{item}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rules;
