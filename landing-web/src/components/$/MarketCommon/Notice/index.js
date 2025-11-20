/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState } from 'react';
import { useSelector } from 'dva';
import classname from 'classname';
import { get } from 'lodash';
import { NOTICE_CONFIG } from '../config';
import styles from './style.less';
import closeSvg from 'assets/registration/close.svg';
import tipSvg from 'assets/registration/tip.svg';

const Notice = ({ namespace = 'luckydrawTurkey' }) => {
  const [visible, setVisible] = useState(true);
  const { isInApp } = useSelector(state => state.app);
  const modalData = useSelector(state => state[namespace]);
  const isAe = get(modalData, 'isAe', false);
  const content = NOTICE_CONFIG[namespace];

  return isInApp || !visible ? null : (
    <div className={styles.notice}>
      <div className={styles.inner}>
        <img
          src={tipSvg}
          alt="notice"
          className={classname(styles.noticeImg, { [styles.noticeImgRever]: isAe })}
        />
        <p className={styles.tipText}>{content.notice}</p>
        <img
          src={closeSvg}
          alt="close"
          className={classname(styles.closeImg, { [styles.closeImgRever]: isAe })}
          onClick={() => setVisible(false)}
        />
      </div>
    </div>
  );
};

export default Notice;
