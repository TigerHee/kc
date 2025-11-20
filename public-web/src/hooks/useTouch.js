/**
 * Owner: chris@kupotech.com
 */
import { useEventCallback } from '@kux/mui/hooks';
import { useEffect } from 'react';

function useTouch({
  enable,
  leftCallback,
  rightCallback,
  topCallback,
  bottomCallback,
  touchConfig = {},
}) {
  let startPoint = null;
  const touchStart = useEventCallback((e) => {
    startPoint = e.touches?.[0];
  });

  const touchEnd = useEventCallback((e) => {
    //e.changedTouches能找到离开手机的手指，返回的是一个数组
    const endPoint = e.changedTouches?.[0];

    //计算终点与起点的差值
    const x = endPoint?.clientX - startPoint?.clientX;
    const y = endPoint?.clientY - startPoint?.clientY;

    //设置滑动距离的参考值
    const diff = 100;

    if (Math.abs(x) > diff) {
      if (x > 0) {
        leftCallback?.();
      } else {
        rightCallback?.();
      }
    }

    if (Math.abs(y) > diff) {
      if (y > 0) {
        // 禁止下滑关闭弹窗
        const el = touchConfig?.maxTouchYId
          ? document.querySelector(`#${touchConfig.maxTouchYId}`)
          : touchConfig?.maxTouchYFunc?.();
        if (el) {
          const posField = touchConfig?.maxTouchYField || 'bottom';
          const bottom = el.getBoundingClientRect()?.[posField] || 0;
          const maxTouchY = bottom || 0;
          if (maxTouchY !== 0 && startPoint?.clientY > maxTouchY) return;
        }
        bottomCallback?.();
      } else {
        topCallback?.();
      }
    }
  });

  useEffect(() => {
    if (enable) {
      document.body.addEventListener('touchstart', touchStart, false);
      document.body.addEventListener('touchend', touchEnd, false);
    }

    return () => {
      document.body.removeEventListener('touchstart', touchStart, false);
      document.body.removeEventListener('touchend', touchEnd, false);
      startPoint = null;
    };
  }, [enable, touchStart, touchEnd]);
}

export default useTouch;
