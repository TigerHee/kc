/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState } from 'react';
import { _t } from 'utils/lang';
import closeSvg from 'assets/registration/close.svg';
import tipSvg from 'assets/registration/tip.svg';
import styles from './style.less';

const Notice = () => {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <div className={styles.notice}>
      <img src={tipSvg} alt="notice" className={styles.noticeImg} />
      <div>{_t('register.notice')}</div>
      <img
        src={closeSvg}
        alt="close"
        className={styles.closeImg}
        onClick={() => setVisible(false)}
      />
    </div>
  ) : null;
};

export default Notice;
