/**
 * Owner: larvide.peng@kupotech.com
 */
import { useEffect, useRef, useState } from 'react';

/**
 * IntersectionObserver的hook
 *
 * @param {Object} options - 在IntersectionObserver API的参数（MDN - https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API） 基础上拓展
 */
const useIntersectionObserver = ({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  /** 是否只触发一次 */
  freezeOnceVisible = false,
  /** 初始是否可见 */
  initialIsIntersecting = false,
  /** 回调 */
  onChange,
} = {}) => {
  const [ref, setRef] = useState(null);
  const [state, setState] = useState(() => ({
    isIntersecting: initialIsIntersecting,
    entry: undefined,
  }));
  const callbackRef = useRef();
  callbackRef.current = onChange;
  const frozen = state.entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    if (!ref) return;
    if (!('IntersectionObserver' in window)) return;
    if (frozen) return;
    let unobserve;
    const observer = new IntersectionObserver(
      (entries) => {
        const thresholds = Array.isArray(observer.thresholds)
          ? observer.thresholds
          : [observer.thresholds];
        entries.forEach((entry) => {
          const isIntersecting =
            entry.isIntersecting &&
            thresholds.some((threshold) => entry.intersectionRatio >= threshold);
          setState({ isIntersecting, entry });
          if (callbackRef.current) {
            callbackRef.current(isIntersecting, entry);
          }
          if (isIntersecting && freezeOnceVisible && unobserve) {
            unobserve();
            unobserve = undefined;
          }
        });
      },
      { threshold, root, rootMargin },
    );
    observer.observe(ref);
    return () => {
      observer.disconnect();
    };
  }, [ref, JSON.stringify(threshold), root, rootMargin, frozen, freezeOnceVisible]);

  const prevRef = useRef(null);
  useEffect(() => {
    if (
      !ref &&
      state.entry?.target &&
      !freezeOnceVisible &&
      !frozen &&
      prevRef.current !== state.entry.target
    ) {
      prevRef.current = state.entry.target;
      setState({ isIntersecting: initialIsIntersecting, entry: undefined });
    }
  }, [ref, state.entry, freezeOnceVisible, frozen, initialIsIntersecting]);
  return {
    ref: setRef,
    nodeEntry: state.entry,
  };
};

export default useIntersectionObserver;
