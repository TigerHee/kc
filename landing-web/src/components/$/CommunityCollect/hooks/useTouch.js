/**
 * Owner: lucas.l.lu@kupotech.com
 * @description 之前 useTouch 的改进版本，支持面板滑动取消关闭
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
        const _touchConfig = touchConfig || {};
        // 禁止下滑关闭弹窗
        const el = _touchConfig.maxTouchYId
          ? document.querySelector(`#${_touchConfig.maxTouchYId}`)
          : _touchConfig.maxTouchYFunc?.();

        if (el) {
          const posField = _touchConfig?.maxTouchYField || 'bottom';
          const bottom = el.getBoundingClientRect?.()?.[posField] || 0;
          const maxTouchY = bottom || 0;

          if (maxTouchY !== 0 && startPoint?.clientY > maxTouchY) {
            return;
          }
        }
        bottomCallback?.();
      } else {
        topCallback?.();
      }
    }
  });

  const addListener = useEventCallback(() => {
    document.body.addEventListener('touchstart', touchStart, false);
    document.body.addEventListener('touchend', touchEnd, false);
  });

  const reset = useEventCallback(() => {
    document.body.removeEventListener('touchstart', touchStart, false);
    document.body.removeEventListener('touchend', touchEnd, false);
    startPoint = null;
  });

  useEffect(() => {
    if (enable) {
      reset();
      addListener();
    } else {
      reset();
    }
    return () => {
      reset();
    };
  }, [enable, addListener, reset]);
}

export default useTouch;
