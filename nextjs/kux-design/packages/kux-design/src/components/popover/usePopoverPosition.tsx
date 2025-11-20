/**
 * Owner: larvide.peng@kupotech.com
 *
 * 计算popover位置，包含 rtl 处理。
 */

import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { handleChangePlacementByDir, getScrollParent } from './tools';
import { IPopoverContent } from '.';
import { useDir } from '@/hooks/useDir';

// popover和包裹内容的偏移值（间隔距离）。
const NormalOffset = 10;

export const usePopoverPosition = (props: IPopoverContent) => {
  const popoverRef = props.popoverRef;
  const AnimationFrameRef = useRef(0);
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const dir = useDir();

  const [popoverPosition, setPopoverPosition] = useState({}); // popover内容的位置
  const [visible, setVisible] = useState(false); // 是否可见。确保在定位完成后再设置为可见，避免闪烁

  useEffect(() => {
    if (!props.isOpen) {
      setVisible(false);
      return;
    }
    
    if (!popoverRef || !popoverRef.current || !popoverContentRef.current) return;
    
    const updatePopoverPosition = () => {
      AnimationFrameRef.current = requestAnimationFrame(() => {
        if (!popoverRef || !popoverRef.current || !popoverContentRef.current) return;
        const styles: CSSProperties = {};
        const newPlacement = handleChangePlacementByDir(props.placement, dir);
        const popoverRect = popoverRef.current.getBoundingClientRect();
        const popoverContentRect = popoverContentRef.current.getBoundingClientRect();

        if (newPlacement.includes('top')) {
          styles.bottom = window.innerHeight - popoverRect.top + NormalOffset;
          if (newPlacement === 'top-start') {
            styles.left = popoverRect.left;
          } else if (newPlacement === 'top-end') {
            styles.right = document.body.clientWidth - popoverRect.left - popoverRect.width;
          } else {
            styles.left =
              popoverRect.left - Math.abs(popoverContentRect.width / 2 - popoverRect.width / 2);
          }
        }
        if (newPlacement.includes('bottom')) {
          styles.top = popoverRect.bottom + NormalOffset;
          if (newPlacement === 'bottom-start') {
            styles.left = popoverRect.left;
          } else if (newPlacement === 'bottom-end') {
            styles.right = document.body.clientWidth - popoverRect.left - popoverRect.width;
          } else {
            styles.left =
              popoverRect.left - Math.abs(popoverContentRect.width / 2 - popoverRect.width / 2);
          }
        }
        if (newPlacement.includes('left')) {
          styles.right = document.body.clientWidth - popoverRect.left + NormalOffset;
          if (newPlacement === 'left-start') {
            styles.top = popoverRect.top;
          } else if (newPlacement === 'left-end') {
            styles.top = popoverRect.top - (popoverContentRect.height - popoverRect.height);
          } else {
            styles.top = popoverRect.top - (popoverContentRect.height / 2 - popoverRect.height / 2);
          }
        }
        if (newPlacement.includes('right')) {
          styles.left = popoverRect.right + NormalOffset;
          if (newPlacement === 'right-start') {
            styles.top = popoverRect.top;
          } else if (newPlacement === 'right-end') {
            styles.top = popoverRect.top - (popoverContentRect.height - popoverRect.height);
          } else {
            styles.top = popoverRect.top - (popoverContentRect.height / 2 - popoverRect.height / 2);
          }
        }
        setPopoverPosition(styles);
        setVisible(true);
      });
    };

    const anchorScrollParent = getScrollParent(popoverRef.current);
    window.addEventListener('scroll', updatePopoverPosition, {
      passive: true,
    });
    window.addEventListener('resize', updatePopoverPosition);
    anchorScrollParent?.addEventListener('scroll', updatePopoverPosition, {
      passive: true,
    });
    anchorScrollParent?.addEventListener('resize', updatePopoverPosition);
    // 初始值
    updatePopoverPosition();

    return () => {
      window.removeEventListener('resize', updatePopoverPosition);
      window.removeEventListener('scroll', updatePopoverPosition);
      anchorScrollParent?.removeEventListener('resize', updatePopoverPosition);
      anchorScrollParent?.removeEventListener('scroll', updatePopoverPosition);
      cancelAnimationFrame(AnimationFrameRef.current);
    };
  }, [dir, props.placement, popoverRef, props.isOpen, visible]);

  return {
    popoverPosition,
    visible,
    dir,
    popoverContentRef,
  };
};
