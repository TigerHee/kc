/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState } from 'react';
import { _t } from 'utils/lang';
import { useSelector } from 'dva';
import classname from 'classname';
import closeSvg from 'assets/registration/close.svg';
import tipSvg from 'assets/registration/tip.svg';
import styles from './style.less';

const Notice = () => {
  const [visible, setVisible] = useState(true);
  const { currentLang } = useSelector(state => state.app);
  const isZh = ['zh_CN', 'zh_HK'].includes(currentLang);
  return visible ? (
    <div className={styles.notice}>
      <img src={tipSvg} alt="notice" className={styles.noticeImg} />
      <div className={styles.tipBox}>
        <div className={classname(styles.tipText, !isZh && styles.tipAnimate)}>{_t('register.notice')}</div>
      </div>
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
