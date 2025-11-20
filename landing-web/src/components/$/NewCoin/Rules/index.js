/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { showDateTimeByZone } from 'helper';
import { _t } from 'utils/lang';
import { get } from 'lodash';
import { useSelector } from 'dva';
import classnames from 'classnames';
import { RULES_CONFIG } from '../config';
import styles from './style.less';

const Rules = ({ namespace = 'newCoinCarnival' }) => {
  const config = RULES_CONFIG[namespace];
  const { config: data } = useSelector(state => state[namespace]);
  const regEndDate = get(data, 'strategy.regStrategy.regEndDate', '');
  const regStartDate = get(data, 'strategy.regStrategy.regStartDate', '');
  const { isInApp } = useSelector(state => state.app);

  return (
    <div className={styles.conditions} inspector="rules">
      <div className={styles.inner}>
        <h2 className={styles.title}>{config.title}</h2>
        <div className={styles.content}>
          {config.content.map((item, index) => {
            let finalItem = item;
            if (index === 0) {
              finalItem = _t('newCoin.rules1', {
                time1: showDateTimeByZone(regStartDate, 'YYYY/MM/DD HH:mm:ss', 0),
                time2: showDateTimeByZone(regEndDate, 'YYYY/MM/DD HH:mm:ss', 0),
              });
            }
            return (
              <p
                className={classnames(styles.contentItems, { [styles.noClick]: isInApp })}
                key={`rules_${index}`}
              >
                <span>{index + 1}</span>.<span>{finalItem}</span>
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Rules;
