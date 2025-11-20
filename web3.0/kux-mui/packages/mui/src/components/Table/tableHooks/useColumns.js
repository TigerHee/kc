/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { EXPAND_COLUMN, INTERNAL_KEY_PREFIX } from '../aux';

function useColumns(
  {
    columns,
    expandable,
    expandIconColumnIndex,
    columnWidth,
    getRowKey,
    expandedKeys,
    rowExpandable,
    expandIcon,
    onTriggerExpand,
    expandRowByClick,
    fixed,
  },
  transformColumns,
) {
  const baseColumns = React.useMemo(() => columns, [columns]);
  const withExpandColumns = React.useMemo(() => {
    if (expandable) {
      let cloneColumns = baseColumns.slice();
      if (!cloneColumns.includes(EXPAND_COLUMN)) {
        const expandColIndex = expandIconColumnIndex || 0;
        if (expandColIndex >= 0) {
          cloneColumns.splice(expandColIndex, 0, EXPAND_COLUMN);
        }
      }

      const expandColumnIndex = cloneColumns.indexOf(EXPAND_COLUMN);
      cloneColumns = cloneColumns.filter(
        (column, index) => column !== EXPAND_COLUMN || index === expandColumnIndex,
      );

      const prevColumn = baseColumns[expandColumnIndex];

      let fixedColumn;
      if ((fixed === 'left' || fixed) && !expandIconColumnIndex) {
        fixedColumn = 'left';
      } else if ((fixed === 'right' || fixed) && expandIconColumnIndex === baseColumns.length) {
        fixedColumn = 'right';
      } else {
        fixedColumn = prevColumn ? prevColumn.fixed : null;
      }

      const expandColumn = {
        [INTERNAL_KEY_PREFIX]: {
          columnType: 'EXPAND_COLUMN',
        },
        title: '',
        fixed: fixedColumn,
        width: columnWidth || '44px',
        render: (_, record, index) => {
          const rowKey = getRowKey(record, index);
          const expanded = expandedKeys.has(rowKey);
          const recordExpandable = rowExpandable ? rowExpandable(record) : true;

          const icon = expandIcon({
            expanded,
            expandable: recordExpandable,
            record,
            onExpand: onTriggerExpand,
          });
          if (expandRowByClick) {
            return <span onClick={(e) => e.stopPropagation()}>{icon}</span>;
          }
          return icon;
        },
      };

      return cloneColumns.map((col) => (col === EXPAND_COLUMN ? expandColumn : col));
    }
    return baseColumns.filter((col) => col !== EXPAND_COLUMN);
  }, [
    expandable,
    baseColumns,
    fixed,
    expandIconColumnIndex,
    columnWidth,
    getRowKey,
    expandedKeys,
    rowExpandable,
    expandIcon,
    onTriggerExpand,
    expandRowByClick,
  ]);

  // ========================= Transform ========================
  const mergedColumns = React.useMemo(() => {
    let finalColumns = withExpandColumns;
    if (transformColumns) {
      finalColumns = transformColumns(finalColumns);
    }

    if (!finalColumns.length) {
      finalColumns = [
        {
          render: () => null,
        },
      ];
    }
    return finalColumns;
  }, [transformColumns, withExpandColumns]);

  return mergedColumns;
}

export default useColumns;
