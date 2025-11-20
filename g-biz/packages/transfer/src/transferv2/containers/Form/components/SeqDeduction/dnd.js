/**
 * Owner: solar@kupotech.com
 */
import { useRef, useMemo, useState } from 'react';
import { DndProvider as OriginDndProvider, useDrag, useDrop } from 'react-dnd';
import { checkIsMobile } from '@transfer/utils/tools';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

const ITEM_TYPE = 'sort_type';

export function useDragAccountSorted({ onDrop, accountType, index }) {
  // 合并 drag 和 drop 的 ref
  const ref = useRef(null);
  const scrollRef = useRef(null);
  const [, dragRef] = useDrag({
    type: ITEM_TYPE,
    item() {
      const eles = document.querySelectorAll('.KuxDrawer-content');
      // 防止带动外层弹窗一起滚动
      if (eles.length) {
        scrollRef.current = eles[eles.length - 1];
        scrollRef.current.style.overflow = 'hidden';
      }
      return { accountType, index };
    },
    end() {
      if (scrollRef.current) {
        scrollRef.current.style.overflow = '';
        scrollRef.current = null;
      }
    },
  });

  const [, dropRef] = useDrop({
    accept: ITEM_TYPE,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      onDrop(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const combinedRef = (el) => {
    dragRef(el);
    dropRef(el);
    ref.current = el;
  };
  return {
    ref: combinedRef,
  };
}

export function DndProvider({ children }) {
  const isMobile = checkIsMobile();
  const Backend = useMemo(() => (isMobile ? TouchBackend : HTML5Backend), [isMobile]);
  return <OriginDndProvider backend={Backend}>{children}</OriginDndProvider>;
}
