/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import cls from 'classname';
import Notification from 'rc-notification';
import successImg from 'assets/global/success.svg';
import errorImg from 'assets/global/error.svg';
import warningImg from 'assets/global/warning.svg';
import styles from './styles.less';

const config = {
  warning: { bg: '#FFF4E4', darkBg: '#282422', img: warningImg },
  error: { bg: '#FCE8E8', darkBg: '#261D24', img: errorImg },
  info: { bg: '#FFFFFF', darkBg: '#13161F' },
  success: { bg: '#E0F6EF', darkBg: '#152529', img: successImg },
};

let notification = null;
Notification.newInstance(
  {
    prefixCls: styles.rcNotificationContainer,
    maxCount: 5,
  },
  n => {
    notification = n;
  },
);

export default props => {
  const {
    type = 'error',
    duration = 3000,
    onClose = () => {},
    className = '',
    theme = 'light',
  } = props;

  const _content = (
    <div
      className={cls([styles.content_wrapper, className])}
      style={{
        animationDelay:  `0s, ${duration/1000}s`,
        background: theme === 'light' ? config[type].bg : config[type].darkBg,
        color: theme === 'light' ? '#01081ede' : 'rgba(255, 255, 255, 0.87)',
      }}
    >
      <>{config[type].img && <img src={config[type].img} alt="" />}</>
      <span>{props.msg || ''}</span>
    </div>
  );

  notification.notice({
    content: _content,
    duration: (duration || 3000) / 1000,
    onClose: () => {
      onClose();
    },
  });
};
