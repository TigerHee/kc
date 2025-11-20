/*
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import cls from 'classname';
import Notification from 'rc-notification';
import styles from './style.less';

// test
let notification = null;
Notification.newInstance(
  {
    prefixCls: styles.rcNotificationContainer,
    maxCount: 1,
  },
  n => {
    notification = n;
  },
);

export default (text, onClose) => {
  const duration = 2000;

  const _content = (
    <div
      className={cls([styles.toast])}
      style={{
        animationDelay: `0s, ${duration / 1000}s`,
      }}
    >
      <span>{text}</span>
    </div>
  );

  notification.notice({
    content: _content,
    duration: (duration || 3000) / 1000,
    onClose: () => {
      typeof onClose === 'function' && onClose();
    },
  });
};
