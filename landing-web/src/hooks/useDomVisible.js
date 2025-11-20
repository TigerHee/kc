/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect } from 'react';

/**
 * Intersection Observer 观察dom是否可见，触发回调函数
 * @param {*} domRef 监听的dom节
 * @param {*} callback 触发时执行回调
 * @param {*} threshold 触发时机 视口百分比
 */
const useDomVisible = (domRef, callback, threshold = [0, 0.01]) => {
  useEffect(
    () => {
      const dom = domRef.current;
      let observer;
      if (dom) {
        observer = new IntersectionObserver(
          ([e]) => {
            typeof callback === 'function' && callback(e.intersectionRatio, dom);
          },
          { threshold },
        );

        observer.observe(dom);
      }
      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    },
    [callback, domRef, threshold],
  );
};

export default useDomVisible;
