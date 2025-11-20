/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import styles from './style.less';

const JoinButton = () => {
  return (
    <a
      inspector="join_btn"
      className={styles.join}
      href="https://forms.gle/WJxEBfvneZk55uZz7"
      target="_blank"
      rel="noopener noreferrer"
    >
      Apply now
    </a>
  );
};

export default JoinButton;
