/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback, useRef, useState, FC } from 'react';
import ResizeObserver from 'packages/header/components/ResizeObserver';
import { throttle } from 'lodash-es';
import clsx from 'clsx';
import { useIsomorphicLayoutEffect } from 'hooks'
import styles from './styles.module.scss'

interface HeadRoomProps {
  children: React.ReactNode;
}

const HeadRoom: FC<HeadRoomProps> = ({ children }) => {
  const [roomHeight, setRoomHeight] = useState(0);
  const fixedRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const dom: HTMLElement | null = fixedRef.current;
    if (dom) {
      setRoomHeight(dom.offsetHeight);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onResize = useCallback(
    throttle(({ height }) => {
      if (height !== roomHeight) {
        setRoomHeight(height);
      }
    }, 300),
    [roomHeight],
  );

  return (
    <div style={{height: roomHeight}} data-class="headerRoomWrapper">
      <ResizeObserver onResize={onResize}>
        <div className={clsx('gbiz-headeroom', styles.headerRoom)} ref={fixedRef}>
          {children}
        </div>
      </ResizeObserver>
    </div>
  );
};

export default HeadRoom;
