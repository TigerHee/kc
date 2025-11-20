/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { COM_LINK } from '../config';
import styles from './style.less';

const CommunityLink = ({ namespace = 'luckydrawTurkey' }) => {
  const content = COM_LINK[namespace];
  return (
    <div className={styles.conditions}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{content.title}</h2>
        <div className={styles.content}>
          {content.conditions.map((item, index) => (
            <p className={styles.contentItems} key={`conditions_${index}`}>
              <span>{item.title}</span>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.link}
              </a>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityLink;
