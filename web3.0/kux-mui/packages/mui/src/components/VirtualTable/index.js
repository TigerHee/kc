import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import useTheme from 'hooks/useTheme';
import { VariableSizeGrid as Grid } from 'react-window';
import ResizeObserver from 'rc-resize-observer';
import Table from '../Table';
import useClassNames from './useClassNames';
import { VirtualTableCell } from './kux';

const rowHeightMap = {
  small: 64,
  basic: 80,
};

const VirtualTable = (props) => {
  const {
    className,
    rowHeight,
    columns = [],
    scroll = {},
    dataSource = [],
    size,
    isEmpty,
    bordered,
    onRowClick,
    direction,
  } = props;
  const theme = useTheme();
  const gridRef = React.useRef();
  const [tableWidth, setTableWidth] = useState(0);
  const _classNames = useClassNames();
  const _rowHeight = rowHeight || rowHeightMap[size] || rowHeightMap.basic;
  const totalHeight = dataSource.length * _rowHeight;
  const widthColumnCount = columns.filter(({ width }) => !width).length;
  const [currentRow, setCurrentRow] = useState(-1);

  const mergedColumns = useMemo(() => {
    return columns.map((column) => {
      if (column.width) {
        return column;
      }
      return {
        ...column,
        width: Math.floor(tableWidth / widthColumnCount),
      };
    });
  }, [columns, tableWidth, widthColumnCount]);

  React.useEffect(() => {
    gridRef.current.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: false,
    });
  }, [dataSource, tableWidth]);

  const renderData = (rawData, rowIndex, columnIndex) => {
    const _data = rawData[rowIndex][mergedColumns[columnIndex].dataIndex];
    if (mergedColumns[columnIndex].render) {
      return mergedColumns[columnIndex].render(_data, rawData[rowIndex], rowIndex);
    }
    return _data;
  };

  const renderVirtualList = (rawData, { scrollbarSize, onScroll }) => (
    <Grid
      ref={gridRef}
      className={_classNames.virtualGrid}
      columnCount={mergedColumns.length}
      columnWidth={(index) => {
        const { width } = mergedColumns[index];
        return totalHeight > scroll.y && index === mergedColumns.length - 1
          ? width - scrollbarSize - 1
          : width;
      }}
      height={scroll.y}
      rowCount={rawData.length}
      rowHeight={() => _rowHeight}
      width={tableWidth}
      direction={direction}
      onScroll={({ scrollLeft }) => onScroll({ scrollLeft })}
    >
      {({ columnIndex, rowIndex, style }) => (
        <VirtualTableCell
          className={clsx(_classNames.virtualTableCell, {
            [_classNames.virtualTableCellRowFirst]: columnIndex === 0,
            [_classNames.virtualTableCellRowLast]: columnIndex === mergedColumns.length - 1,
            [_classNames.virtualTableRowHover]: currentRow === rowIndex,
          })}
          style={{
            ...style,
            boxSizing: 'border-box',
            justifyContent:
              mergedColumns[columnIndex].align === 'right' ? 'flex-end' : 'flex-start',
          }}
          isEmpty={isEmpty}
          bordered={bordered}
          theme={theme}
          onMouseOver={() => setCurrentRow(rowIndex)}
          onMouseLeave={() => setCurrentRow(-1)}
          onClick={() => onRowClick(rawData[rowIndex], rowIndex)}
        >
          {renderData(rawData, rowIndex, columnIndex)}
        </VirtualTableCell>
      )}
    </Grid>
  );

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <Table
        {...props}
        tableLayout="fixed"
        className={clsx(_classNames.virtualTable, className)}
        components={{
          body: renderVirtualList,
        }}
        // key={size} // responsive with size
      />
    </ResizeObserver>
  );
};

VirtualTable.displayName = 'Table';

VirtualTable.propTypes = {
  rowHeight: PropTypes.number,
  onRowClick: PropTypes.func,
};

export default VirtualTable;
// more props see Table
