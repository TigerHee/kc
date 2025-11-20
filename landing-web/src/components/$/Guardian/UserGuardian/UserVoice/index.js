/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import scrollTo from 'antd/lib/_util/scrollTo';
import { _t } from 'src/utils/lang';
import RenderCMS from '../../RenderCMS';
import styles from './style.less';

import subscriptSvg from 'assets/guardian/subscript.svg';

const UserVoice = React.memo(() => {
  const timer1 = React.useRef(null);
  const timer2 = React.useRef(null);
  const contentRef = React.useRef(null);
  const [list, setList] = React.useState([]);
  const [current, setCurrent] = React.useState(0);
  const [animate, setAnimate] = React.useState(true);

  const clearTimer1 = React.useCallback(() => {
    if (timer1.current) {
      clearInterval(timer1.current);
      timer1.current = null;
    }
  }, [timer1]);
  const clearTimer2 = React.useCallback(() => {
    if (timer2.current) {
      clearTimeout(timer2.current);
      timer2.current = null;
    }
  }, [timer2]);

  const getList = React.useCallback(() => {
    if (contentRef.current && typeof contentRef.current.getElementsByTagName === 'function') {
      setList(contentRef.current.getElementsByTagName('section'));
    }
  }, []);

  const next = React.useCallback(() => {
    timer2.current = setTimeout(() => {
      setCurrent(current + 1);
      clearTimer2();
    }, 3000);
  }, [current]);

  const scroll = React.useCallback(() => {
    // 用户手动触发滚轮，取消自动轮播
    if (!animate) return;
    const contentOffsetTop = contentRef.current.offsetTop;
    const currentOffsetTop = list[current].offsetTop;
    const scrollY = currentOffsetTop - contentOffsetTop;
    scrollTo(scrollY, {
      getContainer: () => contentRef.current,
      duration: 500,
    });
    if (current < list.length - 1) {
      next();
    } else {
      setAnimate(false);
    }
  }, [list, current]);

  React.useEffect(() => {
    return () => {
      clearTimer1();
      clearTimer2();
    };
  }, []);

  React.useEffect(() => {
    if (list.length) {
      clearTimer1();
      next();
    } else {
      timer1.current = setInterval(getList, 500);
    }
  }, [list]);

  React.useEffect(() => {
    if (list.length && current) {
      scroll();
    }
  }, [current, list]);

  React.useEffect(() => {
    if (!animate) {
      clearTimer2();
    }
  }, [animate]);

  const handleWheel = React.useCallback(() => {
    if (!animate) return;
    setAnimate(false);
  }, [animate]);

  const height = (list[current] || {}).offsetHeight || 0;
  return (
    <div className={styles.container} {...animate ? {} : { style: { height: 'unset' } }}>
      <img className={styles.subscript} src={subscriptSvg} alt="" />
      <div className={styles.title}>{_t('guardian.userVoice')}</div>
      <div
        ref={contentRef}
        style={{ height }}
        className={styles.content}
        onWheel={handleWheel}
        onTouchMove={handleWheel}
      >
        <RenderCMS run="com.guradian.vioce" />
      </div>
    </div>
  );
});

export default UserVoice;