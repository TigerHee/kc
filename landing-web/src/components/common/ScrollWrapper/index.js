/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect, useRef, useState } from 'react';
import BScroll from '@better-scroll/core';
import Pulldown from '@better-scroll/pull-down';
import Pullup from '@better-scroll/pull-up';
import { isIOS } from 'helper';
import { useSelector } from 'src/hooks/useSelector';
import cls from 'clsx';
import styles from './styles.less';

BScroll.use(Pulldown);
BScroll.use(Pullup);

const ScrollWrapper = ({ className, children, ...rest }) => {
  const bsWrapperRef = useRef(null);
  const [scroll, setScroll] = useState(null);
  const appVersion = useSelector(state => state.app.appVersion);

  useEffect(() => {
    if (!scroll) {
      setScroll(
        new BScroll(bsWrapperRef.current, {
          scrollY: rest.scrollY || true,
          pullUpLoad: rest.pullUpLoad || true,
          // pullDownRefresh: {
          //   threshold: 70,
          //   stop: 60
          // },
          pullDownRefresh: false,
          click: true,
          // 原意是使用css3的transition动画增加滑动体验，当下choice业务已经无用，可以全部改为useTransition:false
          // useTransition: !(isIOS() && (appVersion.indexOf('13.4') !== -1)), // 解决ios 13.4 回弹跳动的问题
          useTransition: false
        })
      )
    }
  }, [appVersion, rest.pullUpLoad, rest.scrollY, scroll]);

  return (
    <div className={cls(styles.bsWrapper, className)} ref={bsWrapperRef} {...rest}>
      {typeof children === 'function' ? children(scroll) : children}
    </div>
  );
};

export default ScrollWrapper;
