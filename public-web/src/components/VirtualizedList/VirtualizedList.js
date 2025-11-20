/**
 * Owner: willen@kupotech.com
 */
import React, { useMemo } from 'react';

const VirtualList = ({
  itemHeight,
  datasource,
  top,
  bottom,
  scrollTop,
  initOffsetTop,
  showRender,
}) => {
  const bufferSize = 12;

  const halfBuffer = Math.floor(bufferSize / 2);

  const dataLen = datasource.length;

  const config = useMemo(() => {
    const contentHeight = bottom - top;
    let shouldRenderLen = Math.floor(contentHeight / itemHeight) + 1 + bufferSize;
    if (initOffsetTop > scrollTop + window.innerHeight && initOffsetTop > window.innerHeight) {
      shouldRenderLen = bufferSize;
    }
    let scrolledLen = 0;
    let startIndex = 0;

    if (scrollTop > initOffsetTop + itemHeight * halfBuffer - 1) {
      scrolledLen = Math.floor((scrollTop - initOffsetTop) / itemHeight);
      startIndex = scrolledLen - halfBuffer - 1;
      startIndex = startIndex > 0 ? startIndex : 0;
    }

    if (startIndex + shouldRenderLen > dataLen) {
      shouldRenderLen = dataLen - startIndex;
      // startIndex = datasource.length - shouldRenderLen - halfBuffer;
    }
    return {
      startIndex,
      shouldRenderLen,
    };
  }, [bufferSize, halfBuffer, itemHeight, scrollTop, dataLen, bottom, top]);

  const { startIndex, shouldRenderLen } = config;

  const _offsetTop = useMemo(() => {
    return (startIndex > 0 ? startIndex - 1 : 0) * itemHeight;
  }, [startIndex, itemHeight]);

  const shouldRenderData = datasource
    .slice(startIndex, startIndex + shouldRenderLen + halfBuffer)
    .filter((v) => !!v);
  return (
    <div
      style={{
        height: `${dataLen * itemHeight}px`,
        width: '100%',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: `${_offsetTop}px`,
          width: '100%',
          left: 0,
        }}
      >
        {shouldRenderData.length ? showRender(shouldRenderData) : null}
      </div>
    </div>
  );
};

export default VirtualList;
