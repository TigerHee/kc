/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import styles from './style.less';

const WithLine = ({ children }) => {
  return (
    <div className={styles.withLineWrap} data-inspector="promotionPage">
      <div className={styles.withLineInner}>
        <>{children}</>
      </div>
      <div className={styles.glowBannerTop} />
      <div className={styles.glowBannerBottom} />
    </div>
  );
};

export default WithLine;
