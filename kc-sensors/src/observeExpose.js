/**
 * Owner: iron@kupotech.com
 */
import isPlainObject from 'lodash/isPlainObject';
import { isElement, noop } from './utils';
import { compose, validateSpm } from './spm';

export default (options) => {
  const exposeMap = new WeakMap();

  const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const getTrackData = exposeMap.get(entry.target);
        if (typeof getTrackData === 'function') {
          const trackData = getTrackData();
          if (isPlainObject(trackData) && validateSpm(trackData.spm)) {
            const { spm, ...params } = trackData;
            window.sensors.track('expose', {
              spm_id: compose(spm),
              ...params,
            });
          }
        }
      }
    });
  };

  let observer = Object.create({ observe: noop, unobserve: noop });

  if (IntersectionObserver) {
    observer = new IntersectionObserver(callback, options);
  }

  return (ele, getTrackData) => {
    if (isElement(ele) && typeof getTrackData === 'function') {
      // 只针对 Dom 进行操作
      exposeMap.set(ele, getTrackData);
      observer.observe(ele);
    }
    // 返回 unobserve 方法
    return () => {
      try {
        // 删除缓存
        exposeMap.delete(ele);
        // 取消观察
        observer.unobserve(ele);
      } catch (e) {
        // ele 对象已经销毁，不做处理
      }
    };
  };
};
