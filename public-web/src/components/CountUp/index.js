/**
 * Owner: John.Qi@kupotech.com
 */
import { useEffect, useRef } from 'react';
const raf =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  function (fn) {
    return window.setTimeout(fn, 16);
  };

const caf =
  window.cancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  function (fn) {
    return window.clearTimeout(fn);
  };

export default function CountUp({ className, from = 0, to, fixed = 0, useComma = false }) {
  const dom = useRef();
  const delayT = useRef();
  const rafId = useRef();
  const startT = useRef();
  const prevT = useRef();
  const prevNum = useRef();
  useEffect(() => {
    const duration = 1000;
    const delay = 200;
    const getText = (el) => {
      const res = el.toFixed(fixed);
      if (useComma) return String(res).replace('.', ',');
      return res;
    };
    const step = () => {
      const now = Date.now();
      if (now - startT.current >= duration) {
        dom.current.innerText = getText(to);
        return;
      }
      const cur = prevNum.current + ((to - from) * (now - prevT.current)) / duration;
      dom.current.innerText = getText(cur);
      prevT.current = now;
      prevNum.current = cur;
      rafId.current = raf(step);
    };
    dom.current.innerText = getText(from);
    prevNum.current = from;
    delayT.current = setTimeout(() => {
      startT.current = Date.now();
      prevT.current = Date.now();
      rafId.current = raf(step);
    }, delay);

    return () => {
      clearTimeout(delayT.current);
      caf(rafId.current);
    };
  }, []);

  return <span className={className} ref={dom} />;
}
