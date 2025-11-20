/**
 * Owner: borden@kupotech.com
 */
import React, { memo, useEffect, useRef } from 'react';

const ScrollWrapper = memo(({ children, className, hidden }) => {
  const tabsRef = useRef(null);

  const handleWheel = (e) => {
    if (!e || !e.deltaY) return;
    if (Math.abs(e.deltaX) > 0) return;
    if (!tabsRef.current) return;
    const _scrollLeft = tabsRef.current.scrollLeft;
    tabsRef.current.scrollLeft = _scrollLeft + -e.deltaY;
  };

  useEffect(() => {
    if (tabsRef.current) {
      tabsRef.current.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (tabsRef.current) {
        tabsRef.current.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <div ref={tabsRef} className={className} hidden={hidden} >
      {children}
    </div>
  );
});

export default ScrollWrapper;
