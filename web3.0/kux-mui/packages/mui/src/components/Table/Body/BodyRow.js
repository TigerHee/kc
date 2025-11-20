/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { TableContext, TableBodyContext } from '../cts/cts';
import Row from '../Row';
import Cell from '../Cell/Cell';
import { getColumnsKey } from '../aux';
import ExpandRow from './ExpandRow';

export default (props) => {
  const {
    record,
    rowKey,
    recordKey,
    renderIndex,
    onRow,
    rowExpandable,
    expandedKeys,
    index,
    childrenColumnName,
    scroll,
  } = props;
  const {
    onTriggerExpand,
    columns,
    size,
    expandedRowRender,
    expandIcon,
    expandableType,
    expandIconColumnIndex,
    expandRowByClick,
    expandedRowClassName,
    rowClassName,
  } = React.useContext(TableBodyContext);

  const { fixedInfoList } = React.useContext(TableContext);

  const [expandRended, setExpandRended] = React.useState(false);

  const expanded = expandedKeys && expandedKeys.has(recordKey);

  React.useEffect(() => {
    if (expanded) {
      setExpandRended(true);
    }
  }, [expanded]);

  const rowSupportExpand = expandableType === 'row' && (!rowExpandable || rowExpandable(record));

  const nestExpandable = expandableType === 'nest';

  const hasNestChildren = childrenColumnName && record && record[childrenColumnName];

  const mergedExpandable = rowSupportExpand || nestExpandable;

  const onExpandRef = React.useRef(onTriggerExpand);

  onExpandRef.current = onTriggerExpand;

  const onInternalTriggerExpand = (...args) => {
    onExpandRef.current(...args);
  };
  let additionalProps = {};
  if (onRow) {
    additionalProps = onRow(record, index);
  }

  const onClick = (event, ...args) => {
    if (expandRowByClick && mergedExpandable) {
      onInternalTriggerExpand(record, event);
    }

    additionalProps?.onClick?.(event, ...args);
  };

  let computeRowClassName;
  if (typeof rowClassName === 'string') {
    computeRowClassName = rowClassName;
  } else if (typeof rowClassName === 'function') {
    computeRowClassName = rowClassName(record, index);
  }

  const columnsKey = getColumnsKey(columns);

  let expandRowNode = null;

  if (rowSupportExpand && (expandRended || expanded)) {
    const colSpan = columns.length;
    const expandContent = expandedRowRender(record, index, expanded);
    const computedExpandedRowClassName =
      expandedRowClassName && expandedRowClassName(record, index);
    expandRowNode = (
      <ExpandRow
        isEmpty={false}
        className={computedExpandedRowClassName}
        colSpan={colSpan}
        expanded={expanded}
        data-row-key={`${rowKey}-expand-row`}
      >
        {expandContent}
      </ExpandRow>
    );
  }

  return (
    <>
      <Row
        {...additionalProps}
        className={computeRowClassName}
        onClick={onClick}
        data-row-key={rowKey}
      >
        {columns.map((column, cellIndex) => {
          const key = columnsKey[cellIndex];
          const fixedInfo = fixedInfoList[cellIndex];

          let appendCellNode;
          if (cellIndex === (expandIconColumnIndex || 0) && nestExpandable) {
            appendCellNode = (
              <>
                <span>
                  {expandIcon({
                    expanded,
                    record,
                    expandable: hasNestChildren,
                    onExpand: onInternalTriggerExpand,
                  })}
                </span>
              </>
            );
          }

          let additionalCellProps;
          if (column.onCell) {
            additionalCellProps = column.onCell(record, index);
          }

          return (
            <Cell
              {...column}
              {...fixedInfo}
              additionalProps={additionalCellProps}
              key={key}
              index={index}
              renderIndex={renderIndex}
              appendNode={appendCellNode}
              record={record}
              component="td"
              rowType="body"
              size={size}
              scroll={scroll}
            />
          );
        })}
      </Row>
      {expandRowNode}
    </>
  );
};
