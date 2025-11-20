/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * h5常用header （左边 中间title 右边）
 * 此header为h5header，在app中也是展示此header，不打开app原生header
 *
 */
import React, { useCallback } from 'react';
import { useSelector } from 'dva';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import goBackIcon from 'assets/christmasNew/back.svg';
import shareImg from 'assets/christmasNew/fixed/share.png';
import clsx from 'classname';
import JsBridge from 'utils/jsBridge';
import { KUCOIN_HOST } from 'utils/siteConfig';
import { addLangToPath } from 'utils/lang';
import Portal from 'components/Portal';
import styles from './style.less';

const H5Header = props => {
  const {
    title = '',
    leftIcon = '',
    onLeftCick = () => {},
    right = false,
    rightIcon = '',
    onRightCick = () => {},
  } = props;
  const { isInApp } = useSelector(state => state.app);
  const paddingTop = isInApp ? '24pt' : 0; //处理在app中的填充padding

  //右边的事件添加判断,并添加防抖
  const clickHandle = useCallback(
    debounce(
      () => {
        if (typeof onRightCick === 'function') onRightCick();
      },
      500,
      { leading: true, trailing: false },
    ),
    [onRightCick],
  );

  //左边事件添加，并添加防抖
  const handleLeft = useCallback(
    debounce(
      () => {
        if (typeof onLeftCick === 'function') {
          onLeftCick();
        } else {
          handleExit();
        }
      },
      500,
      { leading: true, trailing: false },
    ),
    [],
  );

  //默认执行退出返回操作
  const handleExit = useCallback(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'func',
        params: {
          name: 'exit',
        },
      });
    } else {
      window.location.href = addLangToPath(KUCOIN_HOST);
    }
  }, [isInApp]);

  const content = (
    <div className={clsx(styles.headerh5, styles.className)} style={{ paddingTop: paddingTop }}>
      <div className={styles.btnContainer} onClick={handleLeft}>
        <img className={styles.bgImg} src={leftIcon} alt="" />
      </div>
      {title && <span className={styles.title}>{title}</span>}
      {right && (
        <div className={styles.rightBox} onClick={clickHandle}>
          <img className={styles.rightImg} src={rightIcon} alt="" />
        </div>
      )}
    </div>
  );

  return <Portal content={content} />;
};

H5Header.propTypes = {
  onLeftCick: PropTypes.func, // 左边的点击事件处理
  leftIcon: PropTypes.any, //左边的展示图标
  title: PropTypes.any, //中间的展示title
  right: PropTypes.any, //右边的部分
  rightIcon: PropTypes.any, //右边的展示图标
  onRightCick: PropTypes.func, //右边的点击事件处理
  className: PropTypes.any, //样式
};

H5Header.defaultProps = {
  onLeftCick: () => {}, // 左边的点击事件处理
  leftIcon: goBackIcon, //左边的展示图标
  title: '', //中间的展示title
  right: false, //默认无右边展示
  rightIcon: shareImg, //右边的展示图标
  onRightCick: () => {}, //右边的点击事件处理
  className: '', //样式
};

export default H5Header;
