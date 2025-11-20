/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import raf from 'utils/raf';
import ResizeObserver from '../../ResizeObserver';
import MeasureCell from './MeasureCell';

export default function MeasureRow({ columnsKey, onColumnResize }) {
  const resizedColumnsRef = React.useRef(new Map());
  const rafIdRef = React.useRef(null);

  const delayOnColumnResize = () => {
    if (rafIdRef.current === null) {
      rafIdRef.current = raf(() => {
        resizedColumnsRef.current.forEach((width, columnKey) => {
          onColumnResize(columnKey, width);
        });
        resizedColumnsRef.current.clear();
        rafIdRef.current = null;
      }, 2);
    }
  };

  React.useEffect(() => {
    return () => {
      raf.cancel(rafIdRef.current);
    };
  }, []);
  return (
    <tr style={{ height: 0, fontSize: 0 }}>
      <ResizeObserver.Collection
        onBatchResize={(infoList) => {
          infoList.forEach(({ data: columnKey, size }) => {
            resizedColumnsRef.current.set(columnKey, size.offsetWidth);
          });
          delayOnColumnResize();
        }}
      >
        {columnsKey.map((columnKey) => (
          <MeasureCell key={columnKey} columnKey={columnKey} onColumnResize={onColumnResize} />
        ))}
      </ResizeObserver.Collection>
    </tr>
  );
}
