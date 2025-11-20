/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import CopyRight from 'src/components/common/CopyRight';
import styles from './style.less';

const Footer = () => {
  return (
    <div className={styles.container}>
      <CopyRight />
    </div>
  );
};

export default Footer;
