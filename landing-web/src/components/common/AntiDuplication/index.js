/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

const AntiDuplication = ({
  children,
  interval,
  type,
  blockFeedback,
  injectPropsFn,
}) => {
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const getChild = () => {
    if (!children) {
      throw new Error('get children error');
    }
    return React.Children.only(children);
  };

  const startTimer = () => {
    timerRef.current = setTimeout(() => {
      if (setLoading) {
        setLoading(false);
      }
    }, interval);
  };

  const handleClick = (...args) => {
    // 当前为「禁止点击态」
    if (loading) {
      if (typeof blockFeedback === 'function') {
        blockFeedback(...args);
      }
      // 如果是debounce则开启新的定时器
      if (type === 'debounce') {
        clearTimeout(timerRef.current);
        startTimer();
      }
      return;
    }
    // 当前为「可以点击态」
    setLoading(true);
    clearTimeout(timerRef.current);
    startTimer();
    const child = getChild();
    child.props.onClick && child.props.onClick(...args);
  };

  const getTriggerContent = () => {
    const child = getChild();

    let childProps = { ...((child || {}).props || {}) };
    childProps.onClick = handleClick;

    if (injectPropsFn) {
      childProps = { ...childProps, ...injectPropsFn(loading) };
    }

    return React.cloneElement(child, childProps);
  };

  return <React.Fragment>{getTriggerContent()}</React.Fragment>;
};

AntiDuplication.propTypes = {
  children: PropTypes.any.isRequired,
  interval: PropTypes.number,
  type: PropTypes.string,
  blockFeedback: PropTypes.any, //  此函数会在禁用时点击触发 (注意:当antd的Button组件属性为disabled或者loading时是不会触发的)
  injectPropsFn: PropTypes.func, // 函数接收loading状态值，返回一个对象 (注意: 返回的对象的字段会覆盖children中组件上的属性)
};

AntiDuplication.defaultProps = {
  interval: 500,
  type: 'debounce', //debounce/throttle  和lodash的效果一致
};

export default AntiDuplication;
