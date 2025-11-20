/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { isNull } from 'lodash-es';
import styled from 'emotion/index';
import { TableResizeContext, TableBodyContext, TableRowHoverContext } from '../cts/cts';
import BodyRow from './BodyRow';
import Box from '../../Box';
import Empty from '../../Empty';
import ExpandRow from './ExpandRow';
import useFlattenRecords from '../tableHooks/useFlattenRecord';
import MeasureRow from './MeasureRow';
import { getColumnsKey } from '../aux';

const BodyRoot = styled.tbody`
  display: table-row-group;
`;

const EmptyWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 48px;
`;

const TableBody = React.forwardRef((props, ref) => {
  const {
    data,
    locale,
    onRow,
    measureColumnWidth,
    getRowKey,
    childrenColumnName,
    expandedKeys,
    rowExpandable,
    scroll,
  } = props;
  const { columns } = React.useContext(TableBodyContext);
  const { onColumnResize } = React.useContext(TableResizeContext);
  const flattenData = useFlattenRecords(data, childrenColumnName, expandedKeys, getRowKey);

  // ====================== hover =======================
  const [startRow, setStartRow] = React.useState(-1);
  const [endRow, setEndRow] = React.useState(-1);

  const onHover = React.useCallback((start, end) => {
    setStartRow(start);
    setEndRow(end);
  }, []);

  const hoverContextValue = React.useMemo(() => ({ startRow, endRow, onHover }), [
    onHover,
    startRow,
    endRow,
  ]);

  // ====================== render =======================
  const bodyNode = React.useMemo(() => {
    let rows;
    if (data.length) {
      rows = flattenData.map((item, idx) => {
        const { record, indent, index: renderIndex } = item;
        const key = getRowKey(record, idx);
        return (
          <BodyRow
            hover
            onRow={onRow}
            key={key}
            rowKey={key}
            index={idx}
            recordKey={key}
            record={record}
            indent={indent}
            expandedKeys={expandedKeys}
            getRowKey={getRowKey}
            rowExpandable={rowExpandable}
            childrenColumnName={childrenColumnName}
            renderIndex={renderIndex}
            scroll={scroll}
          />
        );
      });
    } else {
      if (isNull(locale)) {
        rows = null;
      } else {
        rows = (
          <ExpandRow expanded isEmpty colSpan={columns.length}>
            <EmptyWrapper>
              <Empty description={locale.emptyText} size="small" {...locale} />
            </EmptyWrapper>
          </ExpandRow>
        );
      }
    }
    const columnsKey = getColumnsKey(columns);
    return (
      <BodyRoot ref={ref}>
        {measureColumnWidth && (
          <MeasureRow columnsKey={columnsKey} onColumnResize={onColumnResize} />
        )}
        {rows}
      </BodyRoot>
    );
  }, [
    childrenColumnName,
    columns,
    data.length,
    locale,
    expandedKeys,
    flattenData,
    getRowKey,
    measureColumnWidth,
    onColumnResize,
    onRow,
    ref,
    rowExpandable,
    scroll,
  ]);

  return (
    <TableRowHoverContext.Provider value={hoverContextValue}>
      {bodyNode}
    </TableRowHoverContext.Provider>
  );
});

TableBody.displayName = 'TableBody';

export default TableBody;
