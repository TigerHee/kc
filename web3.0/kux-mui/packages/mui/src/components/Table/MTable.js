/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import isVisible from 'utils/isVisible';
import shallowEqual from 'utils/showEqual';
import getValue from 'utils/getValue';
import warning from 'utils/warning';
import styled from 'emotion/index';
import isStyleSupport from 'utils/styleChecker';
import {
  TableContext,
  TableStickyContext,
  TableBodyContext,
  TableResizeContext,
  TableExpandedRowContext,
} from './cts/cts';
import ResizeObserver from '../ResizeObserver';
import StickyScrollBar from './StickyScrollBar';
import {
  findAllChildrenKeys,
  getColumnsKey,
  getTargetScrollBarSize,
  getCellFixedInfo,
  validateValue,
} from './aux';
import useColumns from './tableHooks/useColumns';
import useLayoutState from './tableHooks/useLayoutState';
import useTimeoutLock from './tableHooks/useTimeoutLock';
import useStickyOffsets from './tableHooks/useStickyOffsets';
import useSticky from './tableHooks/useSticky';

import Container from './Container';
import Root from './Root';
import Header from './Header/Header';
import Body from './Body/Body';
import ColGroup from './ColGroup';
import FixHolder from './FixHolder/FIxHolder';

const EMPTY_SCROLL_TARGET = {};

const MemoTableContent = React.memo(
  ({ children }) => children,
  (prev, next) => {
    if (!shallowEqual(prev.props, next.props)) {
      return false;
    }

    return prev.pingLeft !== next.pingLeft || prev.pingRight !== next.pingRight;
  },
);

const TableContainer = styled(Container)`
  &::before {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
    width: 30px;
    transition: box-shadow 0.3s;
    content: '';
    pointer-events: none;
  }
  &::after {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
    width: 30px;
    transition: box-shadow 0.3s;
    content: '';
    pointer-events: none;
  }
`;

const MTable = (props) => {
  const {
    columns,
    data,
    size = 'basic',
    expandable,
    transformColumns,
    onRow,
    onHeaderRow,
    scroll,
    showHeader,
    tableLayout,
    rowClassName,
    getRowKey,
    locale,
    sticky,
    bordered,
    headerBorder,
    headerType,
    components,
    direction,
  } = props;
  const {
    expandedRowKeys,
    expandedRowRender,
    onExpand,
    onExpandedRowsChange,
    expandIcon,
    rowExpandable,
    defaultExpandedRowKeys,
    defaultExpandAllRows,
    expandIconColumnIndex,
    expandRowByClick,
    expandedRowClassName,
    expandableType,
  } = expandable;

  if (!expandable.showExpandColumn) {
    expandable.expandIconColumnIndex = -1;
  }

  const [innerExpandedKeys, setInnerExpandedKeys] = React.useState(() => {
    if (defaultExpandedRowKeys) {
      return defaultExpandedRowKeys;
    }
    if (defaultExpandAllRows) {
      return findAllChildrenKeys(data, getRowKey);
    }
    return [];
  });

  const mergedExpandedKeys = React.useMemo(
    () => new Set(expandedRowKeys || innerExpandedKeys || []),
    [expandedRowKeys, innerExpandedKeys],
  );

  const onTriggerExpand = React.useCallback(
    (record) => {
      const key = getRowKey(record);
      const hasKey = mergedExpandedKeys.has(key);
      if (hasKey) {
        mergedExpandedKeys.delete(key);
      } else {
        mergedExpandedKeys.add(key);
      }
      setInnerExpandedKeys(mergedExpandedKeys);
      onExpand?.(!hasKey, record);
      onExpandedRowsChange?.(mergedExpandedKeys);
    },
    [getRowKey, mergedExpandedKeys, onExpand, onExpandedRowsChange],
  );

  // ====================== Column ======================
  const [componentWidth, setComponentWidth] = React.useState(0);

  const baseColumns = useColumns(
    {
      ...expandable,
      columns,
      getRowKey,
      onTriggerExpand,
      expandedKeys: mergedExpandedKeys,
      expandable: !!expandedRowRender,
    },
    transformColumns,
  );

  // ====================== Scroll ======================
  const scrollBodyRef = React.useRef();
  const fullTableRef = React.useRef();
  const scrollHeaderRef = React.useRef();
  const [pingedLeft, setPingedLeft] = React.useState(false);
  const [pingedRight, setPingedRight] = React.useState(false);

  const [colsWidths, updateColsWidths] = useLayoutState(new Map());
  const colsKeys = getColumnsKey(baseColumns);
  const pureColWidths = colsKeys.map((columnKey) => colsWidths.get(columnKey));
  const colWidths = React.useMemo(() => pureColWidths, [pureColWidths]);

  const stickyOffsets = useStickyOffsets(colWidths, baseColumns.length);

  const fixHeader = scroll && validateValue(scroll.y);

  const horizonScroll = scroll && validateValue(scroll.x);

  const fixColumn = horizonScroll && baseColumns.some(({ fixed }) => fixed);

  // Sticky
  const stickyRef = React.useRef();
  const { isSticky, offsetHeader, offsetScroll, container } = useSticky(sticky);

  let scrollXStyle = {};
  let scrollYStyle = {};
  let scrollTableStyle = {};

  if (fixHeader) {
    scrollYStyle = {
      overflowY: 'scroll',
      maxHeight: scroll.y,
    };
  }
  if (horizonScroll) {
    scrollXStyle = { overflowX: 'auto' };
    if (!fixHeader) {
      scrollYStyle = { overflowY: 'hidden' };
    }
    scrollTableStyle = {
      width: scroll?.x === true ? 'auto' : scroll?.x,
      minWidth: '100%',
    };
  }

  const onColumnResize = React.useCallback((columnKey, width) => {
    if (isVisible(fullTableRef.current)) {
      updateColsWidths((widths) => {
        if (widths.get(columnKey) !== width) {
          const newWidths = new Map(widths);
          newWidths.set(columnKey, width);
          return newWidths;
        }
        return widths;
      });
    }
  }, []);

  const [setScrollTarget, getScrollTarget] = useTimeoutLock(null);

  function forceScroll(scrollLeft, target) {
    if (!target) {
      return;
    }
    if (typeof target === 'function') {
      target(scrollLeft);
    } else if (target.scrollLeft !== scrollLeft) {
      target.scrollLeft = scrollLeft;
    }
  }

  const onScroll = ({ currentTarget, scrollLeft }) => {
    const mergedScrollLeft = typeof scrollLeft === 'number' ? scrollLeft : currentTarget.scrollLeft;

    const compareTarget = currentTarget || EMPTY_SCROLL_TARGET;
    if (!getScrollTarget() || getScrollTarget() === compareTarget) {
      setScrollTarget(compareTarget);

      forceScroll(mergedScrollLeft, scrollHeaderRef.current);
      forceScroll(mergedScrollLeft, scrollBodyRef.current);
      forceScroll(mergedScrollLeft, stickyRef.current?.setScrollLeft);
    }

    if (currentTarget) {
      const { scrollWidth, clientWidth } = currentTarget;
      setPingedLeft(mergedScrollLeft > 0);
      setPingedRight(mergedScrollLeft < scrollWidth - clientWidth);
    }
  };

  const triggerOnScroll = () => {
    if (horizonScroll && scrollBodyRef.current) {
      onScroll({ currentTarget: scrollBodyRef.current });
    } else {
      setPingedLeft(false);
      setPingedRight(false);
    }
  };

  const onFullTableResize = ({ width }) => {
    if (width !== componentWidth) {
      triggerOnScroll();
      setComponentWidth(fullTableRef.current ? fullTableRef.current.offsetWidth : width);
    }
  };

  const mounted = React.useRef(false);

  React.useEffect(() => {
    if (mounted.current) {
      triggerOnScroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [horizonScroll, data, columns]);

  React.useEffect(() => {
    mounted.current = true;
  }, []);

  const [scrollbarSize, setScrollbarSize] = React.useState(0);
  const [supportSticky, setSupportSticky] = React.useState(true);

  React.useEffect(() => {
    setScrollbarSize(getTargetScrollBarSize(scrollBodyRef.current).width);
    setSupportSticky(isStyleSupport('position', 'sticky'));
  }, []);

  const getComponent = React.useCallback(
    (path, defaultComponent) => {
      return getValue(components, path) || defaultComponent;
    },
    [components],
  );

  const customizeScrollBody = getComponent(['body']);

  // ====================== render ======================

  const mergedTableLayout = React.useMemo(() => {
    if (tableLayout) {
      return tableLayout;
    }

    if (fixColumn) {
      return scroll?.x === 'max-content' ? 'auto' : 'fixed';
    }
    if (fixHeader || isSticky || baseColumns.some(({ ellipsis }) => ellipsis)) {
      return 'fixed';
    }
    return 'auto';
  }, [tableLayout, fixColumn, fixHeader, isSticky, baseColumns, scroll?.x]);

  let groupTableNode;
  const headerProps = {
    colWidths,
    columCount: baseColumns.length,
    stickyOffsets,
    fixHeader,
    onHeaderRow,
    scroll,
    bordered,
    headerBorder,
    headerType,
    size,
  };
  const bodyColGroup = (
    <ColGroup colWidths={baseColumns.map(({ width }) => width)} columns={baseColumns} />
  );
  const bodyTable = (
    <Body
      expandedKeys={mergedExpandedKeys}
      measureColumnWidth={fixHeader || horizonScroll || isSticky}
      locale={locale}
      rowExpandable={rowExpandable}
      data={data}
      onRow={onRow}
      getRowKey={getRowKey}
      scroll={scroll}
    />
  );

  if (fixHeader || isSticky) {
    let bodyContent;
    if (typeof customizeScrollBody === 'function') {
      bodyContent = customizeScrollBody(data, {
        scrollbarSize,
        ref: scrollBodyRef,
        onScroll,
      });
      headerProps.colWidths = baseColumns.map(({ width }, index) => {
        const colWidth = index === columns.length - 1 ? width - scrollbarSize : width;
        if (typeof colWidth === 'number' && !Number.isNaN(colWidth)) {
          return colWidth;
        }

        if (process.env.NODE_ENV !== 'production') {
          warning(
            props.columns.length === 0,
            'When use virtual scroll, each column should have a fixed `width` value.',
          );
        }
        return 0;
      });
    } else {
      bodyContent = (
        <Container
          style={{
            ...scrollXStyle,
            ...scrollYStyle,
          }}
          onScroll={onScroll}
          ref={scrollBodyRef}
        >
          <Root
            style={{
              ...scrollTableStyle,
              tableLayout: mergedTableLayout,
            }}
          >
            {bodyColGroup}
            {bodyTable}
          </Root>
        </Container>
      );
    }

    const fixedHolderProps = {
      noData: !data.length,
      maxContentScroll: horizonScroll && scroll.x === 'max-content',
      columns: baseColumns,
      onScroll,
      ...headerProps,
    };
    groupTableNode = (
      <>
        {!!showHeader && (
          <FixHolder {...fixedHolderProps} ref={scrollHeaderRef} stickyTopOffset={offsetHeader}>
            {(fixedHolderPassProps) => {
              return <Header {...fixedHolderPassProps} />;
            }}
          </FixHolder>
        )}
        {bodyContent}
        {isSticky && (
          <StickyScrollBar
            ref={stickyRef}
            offsetScroll={offsetScroll}
            scrollBodyRef={scrollBodyRef}
            onScroll={onScroll}
            container={container}
          />
        )}
      </>
    );
  } else {
    groupTableNode = (
      <Container
        style={{
          ...scrollXStyle,
          ...scrollYStyle,
        }}
        onScroll={onScroll}
        ref={scrollBodyRef}
      >
        <Root
          style={{
            ...scrollTableStyle,
            tableLayout: mergedTableLayout,
          }}
        >
          {bodyColGroup}
          {showHeader !== false && <Header {...headerProps} columns={baseColumns} />}
          {bodyTable}
        </Root>
      </Container>
    );
  }
  let fullTable = (
    <Container ref={fullTableRef}>
      <MemoTableContent
        pingLeft={pingedLeft}
        pingRight={pingedRight}
        props={{ ...props, stickyOffsets, mergedExpandedKeys }}
      >
        <TableContainer>{groupTableNode}</TableContainer>
      </MemoTableContent>
    </Container>
  );

  if (horizonScroll) {
    fullTable = <ResizeObserver onResize={onFullTableResize}>{fullTable}</ResizeObserver>;
  }

  const tableContextValue = React.useMemo(() => {
    return {
      scrollbarSize,
      pingedLeft,
      pingedRight,
      isSticky,
      bordered,
      fixedInfoList: baseColumns.map((_, colIndex) =>
        getCellFixedInfo(colIndex, colIndex, baseColumns, stickyOffsets),
      ),
      direction,
    };
  }, [
    baseColumns,
    bordered,
    isSticky,
    pingedLeft,
    pingedRight,
    scrollbarSize,
    stickyOffsets,
    direction,
  ]);

  const bodyContextValue = React.useMemo(() => {
    return {
      tableLayout: mergedTableLayout,
      expandIcon,
      columns: baseColumns,
      expandedRowRender,
      expandRowByClick,
      expandableType,
      expandIconColumnIndex,
      expandedRowClassName,
      rowClassName,
      onTriggerExpand,
      size,
    };
  }, [
    baseColumns,
    expandIcon,
    expandIconColumnIndex,
    expandRowByClick,
    expandableType,
    expandedRowClassName,
    expandedRowRender,
    mergedTableLayout,
    rowClassName,
    onTriggerExpand,
    size,
  ]);

  const expandedRowContextValue = React.useMemo(
    () => ({
      componentWidth,
      fixHeader,
      fixColumn,
      horizonScroll,
    }),
    [componentWidth, fixHeader, fixColumn, horizonScroll],
  );

  const resizeContextValue = React.useMemo(() => ({ onColumnResize }), [onColumnResize]);

  return (
    <>
      <TableStickyContext.Provider value={supportSticky}>
        <TableContext.Provider value={tableContextValue}>
          <TableBodyContext.Provider value={bodyContextValue}>
            <TableExpandedRowContext.Provider value={expandedRowContextValue}>
              <TableResizeContext.Provider value={resizeContextValue}>
                {fullTable}
              </TableResizeContext.Provider>
            </TableExpandedRowContext.Provider>
          </TableBodyContext.Provider>
        </TableContext.Provider>
      </TableStickyContext.Provider>
    </>
  );
};

export default MTable;
