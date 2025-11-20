/**
 * Owner: willen@kupotech.com
 */
import React, { useRef, useEffect } from 'react';

const CustomSwipeContainer = (props) => {
  const containerRef = useRef(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const { className = '', onSwipeLeft, onSwipeRight, onScroll } = props;
  const _onSwipeLeft = () => {
    onSwipeLeft && onSwipeLeft();
  };
  const _onSwipeRight = () => {
    onSwipeRight && onSwipeRight();
  };
  const _onScroll = () => {
    onScroll && onScroll(containerRef.current);
  };
  const onTouchStart = (e, isTouch = true) => {
    e.stopPropagation();
    const { clientX, clientY } = isTouch ? e.changedTouches[0] : e;
    touchStartPos.current = {
      x: clientX,
      y: clientY,
    };
  };
  const onTouchEnd = (e, isTouch = true) => {
    e.stopPropagation();
    const { clientX, clientY } = isTouch ? e.changedTouches[0] : e;
    const { x, y } = touchStartPos.current;
    if (!x || !y) {
      return;
    }
    // 移动端判断起始距离很短
    const checkMinDis = isTouch ? 1 : document.body.clientWidth * 0.1;
    // x方向滑动距离不够，不用管
    if (Math.abs(clientX - x) < checkMinDis) {
      return;
    }
    const angle = Math.atan(Math.abs(clientY - y) / Math.abs(clientX - x));
    // 如果角度大于30度，不相应进行滑动
    if (angle > Math.PI / 6) {
      return;
    }
    // 如果手指划向右侧，那就后退1，往左侧那就前进1
    const dir = clientX > x ? 'right' : 'left';
    if (dir === 'left') {
      _onSwipeLeft();
    } else {
      _onSwipeRight();
    }
    touchStartPos.current = {
      x: 0,
      y: 0,
    };
  };
  const _touchMove = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    document.body.addEventListener('touchmove', _touchMove);
    window.addEventListener('scroll', _onScroll);
    return () => {
      document.body.removeEventListener('touchmove', _touchMove);
      window.removeEventListener('scroll', _onScroll);
    };
  }, [_onScroll]);

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseDown={(e) => onTouchStart(e, false)}
      onMouseUp={(e) => onTouchEnd(e, false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchEnd}
    >
      {props.children}
    </div>
  );
};

export default CustomSwipeContainer;
