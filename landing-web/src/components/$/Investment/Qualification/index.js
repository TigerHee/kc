/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import { List } from './const';
import styles from './style.less';

const Qualification = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div inspector="qualification_title" className={styles.title}>
          Project Selection Criteria
        </div>
      </div>
      <div className={styles.qualification}>
        {map(List, item => {
          return (
            <div inspector="qualification_item" className={styles.item}>
              <img src={item.imgUrl} alt="img" />
              <div>{item.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Qualification;
