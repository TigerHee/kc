/**
 * Owner: larvide.peng@kupotech.com
 *
 * 处理 Modal 组件下滑手势
 */
import { useEffect, useState } from 'react';
import { formatStyleUnit, Slide, type  IDragPosition, type TEndCallback } from '@/common';

interface IDownSlideProps {
  isOpen: boolean,
  dom: HTMLElement | null;
  disable?: boolean;
  downFinish: () => void;
}

/**
 * 只处理单个自由度拖动
 */
export const useDownSlide = (props: IDownSlideProps) => {
  const [position, setPosition] = useState<Record<string, string>>({
    '--kux-modal-drag-bottom': formatStyleUnit(0, 'length'),
  });

  useEffect(() => {
    const getTouchStateHandler = (delta: IDragPosition) => {
      if (props.disable) return
      const newPositionStyle = {
        '--kux-modal-drag-bottom': formatStyleUnit(delta.y > 0 ? -delta.y : 0, 'length'),
      }
      setPosition(newPositionStyle);
    }

    const slideDown: TEndCallback = (position) => {
      const { direction } = position;
      if (direction === 'down') {
        props.downFinish()
      }
    }

    const slider = new Slide({
      rootDom: props.dom!,
      onMove: getTouchStateHandler,
      onEnd: slideDown,
      arrowDirection: ['down', 'up'],
    });

    return () => {
      if (!props.isOpen) {
        setPosition({
          '--kux-modal-drag-bottom': formatStyleUnit(0, 'length'),
        })
      }
      slider.unbind();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dom, props.disable, props.isOpen]);

  return position;
};
