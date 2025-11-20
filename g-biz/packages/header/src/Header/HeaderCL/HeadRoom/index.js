/**
 * Owner: iron@kupotech.com
 */
import { ResizeObserver, styled, useTheme } from '@kux/mui';
import { throttle } from 'lodash';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

const HeaderRoomWrapper = styled.div`
  height: ${(props) => props.roomHeight}px;
`;

const HeaderRoom = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: ${(props) => props.theme.colors.overlay};
  transition: background-color 0.5s ease;
`;

const HeadRoom = ({ children }) => {
  const [roomHeight, setRoomHeight] = useState(0);
  const fixedRef = useRef();
  const theme = useTheme();

  useLayoutEffect(() => {
    const dom = fixedRef.current;
    setRoomHeight(dom.offsetHeight);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onResize = useCallback(
    throttle((size) => {
      if (size.offsetHeight !== roomHeight) {
        setRoomHeight(size.offsetHeight);
      }
    }, 300),
    [roomHeight],
  );

  return (
    <HeaderRoomWrapper roomHeight={roomHeight} data-class="headerRoomWrapper">
      <ResizeObserver onResize={onResize}>
        <HeaderRoom theme={theme} className="gbiz-headeroom" ref={fixedRef}>
          {children}
        </HeaderRoom>
      </ResizeObserver>
    </HeaderRoomWrapper>
  );
};

export default HeadRoom;
