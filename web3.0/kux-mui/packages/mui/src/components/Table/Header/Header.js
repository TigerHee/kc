/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import Cell from '../Cell/Cell';
import Row from '../Row';
import { getColumnsKey, getCellFixedInfo } from '../aux';

const TableHeadRoot = styled.thead`
  display: table-header-group;
`;

const TableHeadRow = styled(Row)`
  [dir='rtl'] & {
    vertical-align: top;
  }
`;

function parseHeaderRows(rootColumns) {
  const rows = [];

  function fillRowCells(columns, colIndex) {
    let currentColIndex = colIndex;

    const colSpans = columns.filter(Boolean).map((column) => {
      const cell = {
        ...column,
        key: column.key,
        colStart: currentColIndex,
        rowSpan: 1,
      };

      let colSpan = 1;

      if ('colSpan' in column) {
        ({ colSpan } = column);
      }

      if ('rowSpan' in column) {
        cell.rowSpan = column.rowSpan;
      }

      cell.colSpan = colSpan;
      cell.colEnd = cell.colStart + colSpan - 1;
      rows.push(cell);

      currentColIndex += colSpan;

      return colSpan;
    });

    return colSpans;
  }

  fillRowCells(rootColumns, 0);

  return rows;
}

const TableHead = (props) => {
  const {
    columns,
    stickyOffsets,
    onHeaderRow,
    headerBorder,
    headerType,
    size,
    scroll,
    ...others
  } = props;
  const rows = React.useMemo(() => parseHeaderRows(columns), [columns]);
  const columnKeys = getColumnsKey(columns);

  let rowProps = {};

  if (onHeaderRow) {
    rowProps = onHeaderRow(columns);
  }

  return (
    <TableHeadRoot {...others}>
      <TableHeadRow {...rowProps}>
        {rows.map((row, cellIndex) => {
          const { align, ellipsis, title, ...rest } = row;
          const fixedInfo = getCellFixedInfo(row.colStart, row.colEnd, columns, stickyOffsets);
          let titleNode = title;
          if (typeof title === 'function') {
            titleNode = title();
          }
          let additionalProps;
          if (row && row.onHeaderCell) {
            additionalProps = row.onHeaderCell(row);
          }
          return (
            <Cell
              {...rest}
              {...fixedInfo}
              align={align}
              ellipsis={ellipsis}
              key={columnKeys[cellIndex]}
              component="th"
              rowType="header"
              additionalProps={additionalProps}
              headerBorder={headerBorder}
              headerType={headerType}
              size={size}
              scroll={scroll}
            >
              {titleNode}
            </Cell>
          );
        })}
      </TableHeadRow>
    </TableHeadRoot>
  );
};

TableHead.displayName = 'TableHead';

export default TableHead;
