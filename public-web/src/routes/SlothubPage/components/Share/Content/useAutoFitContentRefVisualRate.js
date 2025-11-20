/*
 * Owner: harry.lai@kupotech.com
 */
import { useCallback, useEffect, useRef } from 'react';

const offsetMarginValue = 40;

export const useAutoFitContentRefVisualRate = () => {
  const domRef = useRef(null);

  const onLayoutAutoFitVisualRate = useCallback(() => {
    const [customNodeElement, rootWrapElement] = [
      domRef.current?.parentElement,
      domRef.current?.parentElement?.parentElement,
    ];
    if (!customNodeElement || !rootWrapElement) return;
    // 监听可容纳区域高度
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === rootWrapElement) {
          const isOutOfView = customNodeElement.offsetHeight > rootWrapElement.offsetHeight;
          if (isOutOfView) {
            const scaleDownRatio =
              Math.floor(
                ((rootWrapElement.offsetHeight - offsetMarginValue) /
                  customNodeElement.offsetHeight) *
                  100,
              ) / 100;
            customNodeElement.style.transform = `scale(${scaleDownRatio})`;
          }
        }
      }
    });

    resizeObserver.observe(rootWrapElement);
    return () => {
      resizeObserver.unobserve(rootWrapElement);
    };
  }, []);

  useEffect(() => {
    onLayoutAutoFitVisualRate();
  }, [onLayoutAutoFitVisualRate]);

  return domRef;
};
