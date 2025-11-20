/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import ProgressItem from './PrizeItemBar';
import styles from './styles.less';

// 每日交易量
const PrizeProgressBar = props => {
  const { prizeList } = props;
  return (
    <div className={styles.progressBody}>
      {prizeList.map((prize, idx) => (
        <ProgressItem
          data={prize}
          key={`ProgressItem-${idx}`}
          level={idx + 1}
          isMultiTask={Boolean(prizeList.length > 1)}
          {...props}
        />
      ))}
    </div>
  );
};

export default PrizeProgressBar;
