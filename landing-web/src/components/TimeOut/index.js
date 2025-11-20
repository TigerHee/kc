/**
 * Owner: jesse.shao@kupotech.com
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useEffect, useState } from 'react';
import classnames from 'classname';
import { _t } from 'src/utils/lang';
import PropTypes from 'prop-types';
import { genTimeBox, genTimeObj } from './config';
import styles from './styles.less';

const hiddenProperty =
  'hidden' in document
    ? 'hidden'
    : 'webkitHidden' in document
    ? 'webkitHidden'
    : 'mozHidden' in document
    ? 'mozHidden'
    : null;
const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');

/**
 * 倒计时组件，支持PC和H5
 * @returns 一种：带默认样式的倒计时组件，一种：返回子组件添加上time对象属性，方便自定义样式
 */

const TimeOut = props => {
  const {
    time,
    type,
    classes,
    suffixes,
    onFinish,
    needZeroGray,
    needVisibilityChange,
    children,
  } = props;
  let timer = null;
  const [dynamicTime, setDynamicTime] = useState(time);
  const [refresh, setRefresh] = useState(false);
  const timeObj = genTimeObj(dynamicTime);
  useEffect(() => {
    setDynamicTime(time);
  }, []);

  // 每1s都会调用一次
  const timeTransition = useCallback(
    maxtime => {
      timer = setInterval(function f() {
        if (maxtime >= 1000) {
          maxtime -= 1000;
          setDynamicTime(maxtime);
        } else {
          setDynamicTime(0);
          // 间隔一秒钟，等待接口获取最新的倒计时，后续优化根据真正的接口获取时间
          setTimeout(() => setRefresh(!refresh), 1000);
          clearInterval(timer);
          onFinish();
          return;
        }
      }, 1000);
    },
    [time, refresh],
  );

  // 其他tab切回来时重新拉取倒计时
  useEffect(() => {
    if (timer) {
      clearInterval(timer);
    }
    setDynamicTime(time);
    const onVisibilityChange = () => {
      if (!document[hiddenProperty]) {
        onFinish();
      }
    };
    if (needVisibilityChange) {
      document.addEventListener(visibilityChangeEvent, onVisibilityChange);
    }
    if (time > 1000) {
      timeTransition(time);
    }
    return () => {
      clearInterval(timer);
      document.removeEventListener(visibilityChangeEvent, onVisibilityChange);
    };
  }, [time, refresh]);
  //如果存在子组件,则添加属性时间对象返回原组件：{d: 'xx',h: 'xx',m: 'xx',s: 'xx',}
  if (React.isValidElement(children)) {
    return React.cloneElement(children, { time: timeObj });
  }

  //默认返回genTimeBox函数处理的内容样式
  return (
    <span className={classnames(styles.time, classes.root)}>
      {genTimeBox(type, classes, timeObj, suffixes, needZeroGray)}
    </span>
  );
};

TimeOut.propTypes = {
  time: PropTypes.number, //时间毫秒数
  type: PropTypes.any, //展示的时间类型
  classes: PropTypes.object, //样式类名
  suffixes: PropTypes.object, //后缀
  onFinish: PropTypes.func, //倒计时结束的函数处理
  needZeroGray: PropTypes.oneOf([true, false]), //倒计时结束后0的展示是否需要灰色
  needVisibilityChange: PropTypes.oneOf([true, false]), //页面隐藏后是否需要更新倒计时
  children: PropTypes.any, //是否存在子组件
};

TimeOut.defaultProps = {
  time: 0,
  type: 'hms', //展示的时间类型
  classes: {}, //样式类名
  suffixes: {
    dsuffix: _t('choice.banner.time.day'),
    hsuffix: ':',
    msuffix: ':',
    ssuffix: null,
  }, //后缀
  onFinish: () => {}, //倒计时结束的函数处理
  needZeroGray: false, //倒计时结束后0的展示是否需要灰色
  needVisibilityChange: true, //页面隐藏后是否需要更新倒计时
  children: null, //默认使用genTimeBox返回的样式
};
export default memo(TimeOut);
