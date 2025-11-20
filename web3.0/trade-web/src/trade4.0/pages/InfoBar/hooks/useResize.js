/*
 * Owner: clyne@kupotech.com
 */
import { debounce } from 'lodash';
import { useEffect, useRef, useCallback } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { useIsRTL } from 'src/trade4.0/hooks/common/useLang';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { event } from 'src/trade4.0/utils/event';

let leftResizeObserver;
let rightResizeObserver;
const delay = 50;
const diff = 24;
const tickerMarginLeft = 24;

export const useResize = () => {
  const rightRef = useRef();
  const leftRef = useRef();
  const tradeType = useTradeType();
  const isRTL = useIsRTL();
  useEffect(() => {
    if (rightRef.current && leftRef.current && tradeType) {
      // node
      const nodeL = leftRef.current;
      const nodeR = rightRef.current;
      const wrapperNode = document.querySelector('.infoBar');
      // width监听函数
      const fx = debounce(() => {
        const items = wrapperNode.querySelectorAll('.ticker-item');
        const moreNode = wrapperNode.querySelector('.ticker-more');
        const robotNode = wrapperNode.querySelector('.robotCls');
        const tickLeft = document.querySelector('.ticker-left');
        const LPNode = document.querySelector('.item-list');
        if (!LPNode || !tickLeft) {
          return;
        }
        const fullW = wrapperNode.offsetWidth;
        const lastPriceW = LPNode.offsetWidth;
        const rightW = nodeR.offsetWidth;
        const tickLW = tickLeft.offsetWidth;
        const robotNodeW = robotNode?.offsetWidth || 0;
        const moreW = 60;

        let itemsW = 0;
        let hiddenIndex = items.length;
        // reset(items);
        for (let i = 0; i < items.length; i++) {
          const childNode = items[i];
          if (childNode) {
            // 累加items的空间
            itemsW += childNode.offsetWidth + tickerMarginLeft;
            // 下一个item的占位大小
            const _diff = fullW - robotNodeW - rightW - moreW - tickLW - itemsW - lastPriceW;
            if (_diff <= diff) {
              hiddenIndex = i;
              break;
            }
          }
        }

        // 处理item显示或隐藏
        for (let j = 0; j < items.length; j++) {
          const childNode = items[j];
          if (childNode) {
            if (j >= hiddenIndex) {
              childNode.style.visibility = 'hidden';
            } else {
              childNode.style.visibility = 'visible';
            }
          }
        }
        if (moreNode) {
          let transformX = 0;
          const rightX = nodeR.getBoundingClientRect().left;
          const lastNode = items[hiddenIndex];
          if (lastNode) {
            const lastX = lastNode.getBoundingClientRect().left;
            if (!isRTL) {
              transformX = rightX - lastX - moreW + 24;
              transformX = transformX < 0 ? 0 : transformX;
              moreNode.style.transform = `translate3d(${-transformX}px, 0, 0)`;
            } else {
              const lastR = lastNode.getBoundingClientRect().right;
              const rightR = nodeR.getBoundingClientRect().right;
              transformX = lastR - rightR - moreW + 24;
              transformX = transformX < 0 ? 0 : transformX;
              moreNode.style.transform = `translate3d(${transformX}px, 0, 0)`;
            }
          }
        }

        event.emit('HEADER_HIDDEN_INDEX', { hiddenIndex });
      }, delay);
      leftResizeObserver = new ResizeObserver((entries) => {
        fx(entries);
      });
      rightResizeObserver = new ResizeObserver((entries) => {
        fx(entries);
      });

      leftResizeObserver.observe(nodeL);
      rightResizeObserver.observe(nodeR);
      event.on('INIT_MORE', () => fx());
      return () => {
        event.off('INIT_MORE');
        leftResizeObserver.unobserve(nodeL);
        rightResizeObserver.unobserve(nodeR);
      };
    }
  }, [rightRef, leftRef, tradeType, isRTL]);

  useEffect(() => {
    const handle = () => {
      resetMore();
    };
    window.addEventListener('resize', handle);

    return () => {
      window.removeEventListener('resize', handle);
    };
  }, [resetMore]);

  const resetMore = useCallback(() => {
    event.emit('INIT_MORE');
  }, []);

  useEffect(() => {
    // 偷懒一波
    setTimeout(() => {
      event.emit('INIT_MORE');
    }, 3000);
  }, []);

  return { rightRef, leftRef, resetMore };
};
