/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import fillRef from 'utils/fillRef';
import { TableContext } from '../cts/cts';
import Root from '../Root';
import ColGroup from '../ColGroup';

function useColumnWidth(colWidths, columCount) {
  return React.useMemo(() => {
    const cloneColumns = [];
    for (let i = 0; i < columCount; i += 1) {
      const val = colWidths[i];
      if (val !== undefined) {
        cloneColumns[i] = val;
      } else {
        return null;
      }
    }
    return cloneColumns;
  }, [colWidths, columCount]);
}

const FixedHolder = React.forwardRef(
  (
    {
      children,
      columns,
      fixHeader,
      maxContentScroll,
      noData,
      columCount,
      colWidths,
      onScroll,
      stickyOffsets,
      stickyTopOffset,
      ...restProps
    },
    ref,
  ) => {
    const { scrollbarSize, isSticky } = React.useContext(TableContext);

    const combinationScrollBarSize = isSticky && !fixHeader ? 0 : scrollbarSize;

    const scrollRef = React.useRef(null);

    const setScrollRef = React.useCallback((element) => {
      fillRef(ref, element);
      fillRef(scrollRef, element);
    }, []);

    React.useEffect(() => {
      function onWheel(e) {
        const { currentTarget, deltaX } = e;
        if (deltaX) {
          onScroll({ currentTarget, scrollLeft: currentTarget.scrollLeft + deltaX });
          e.preventDefault();
        }
      }

      scrollRef.current?.addEventListener('wheel', onWheel);

      return () => {
        scrollRef.current?.removeEventListener('wheel', onWheel);
      };
    }, []);

    const allColumnsWithWidth = React.useMemo(() => columns.every((column) => column.width >= 0), [
      columns,
    ]);

    const lastColumn = columns[columns.length - 1];

    const ScrollBarColumn = {
      fixed: lastColumn ? lastColumn.fixed : null,
      scrollbar: true,
    };

    const columnsWithScrollbar = React.useMemo(
      () => (combinationScrollBarSize ? [...columns, ScrollBarColumn] : columns),
      [combinationScrollBarSize, columns],
    );

    const headerStickyOffsets = React.useMemo(() => {
      const { right, left } = stickyOffsets;
      return {
        ...stickyOffsets,
        left,
        right: [...right.map((width) => width + combinationScrollBarSize), 0],
        isSticky,
      };
    }, [combinationScrollBarSize, isSticky, stickyOffsets]);

    const mergedColumnWidth = useColumnWidth(colWidths, columCount);

    return (
      <div
        ref={setScrollRef}
        style={{
          // overflow: 'hidden',
          ...(isSticky ? { top: stickyTopOffset, position: 'sticky', zIndex: 3 } : {}),
        }}
      >
        <Root
          style={{
            tableLayout: 'fixed',
          }}
        >
          {(!noData || !maxContentScroll || allColumnsWithWidth) && (
            <ColGroup
              colWidths={mergedColumnWidth ? [...mergedColumnWidth, combinationScrollBarSize] : []}
              columCount={columCount + 1}
              columns={columnsWithScrollbar}
            />
          )}
          {children({
            ...restProps,
            stickyOffsets: headerStickyOffsets,
            columns: columnsWithScrollbar,
          })}
        </Root>
      </div>
    );
  },
);

export default FixedHolder;
