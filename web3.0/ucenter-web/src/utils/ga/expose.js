/**
 * Owner: willen@kupotech.com
 */

import React from 'react';

// 返回空方法，避免$KcSensors拿不到
function doNothing() {}

const noop = () => {
  return doNothing;
};

// 封装的kcsensors-observeExpose(options)
// 用于常规的曝光上报
export const exposeContext = React.createContext();

/**
 *
 * @param {*} ref useRef实例
 * @param {*} getTrackParams
 */
export const useExpose = (ref, getTrackParams) => {
  const { instance } = React.useContext(exposeContext);
  // 可能存在无useMemo传入getTrackParams的情况，故getTrackParams不追踪
  const getTrackParamsWrapper = React.useRef(getTrackParams);
  React.useEffect(() => {
    if (instance) {
      return instance((ref && ref.current) || ref, getTrackParamsWrapper.current);
    }
  }, [ref]);
};

// 高阶-，用于inject注入 observeExpose实例，没主动完成Observe方法调用，只是提供实例prop
export const injectExpose = (WrappedComponent) => (props) => {
  const exposeProps = {};
  const { instance } = React.useContext(exposeContext);
  if (instance) {
    exposeProps.trackObserve = instance;
  } else {
    exposeProps.trackObserve = noop;
  }
  return <WrappedComponent {...props} {...exposeProps} />;
};
