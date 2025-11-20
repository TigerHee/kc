/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import { map } from 'lodash';
import clxs from 'classnames';
import { Table, TableHead, TableBody, TableRow, TableCell, Spin } from '@kc/mui';
import Empty from 'components/common/KcEmpty';
import styles from './style.less';

const plainObj = {};
const ORDER_DIRECTION = {
  asc: 'asc', // 上
  desc: 'desc', // 下
};
const getDirection = (order) => ORDER_DIRECTION[order] || false;
// 上 -> 下 -> 默认排序
const getNextOrder = (sorter, field) => {
  if (sorter.field !== field) return ORDER_DIRECTION.desc;
  if (sorter.order === ORDER_DIRECTION.desc) return ORDER_DIRECTION.asc;
  if (sorter.order === ORDER_DIRECTION.asc) return false;
  return ORDER_DIRECTION.desc;
};

const SortLabel = ({ sorter, active, order, onClick, children, tips }) => {
  const cls = clxs({
    [styles.label]: !!sorter,
    [styles.asc]: active && order === ORDER_DIRECTION.asc,
    [styles.desc]: active && order === ORDER_DIRECTION.desc,
  });
  return (
    <div className={styles.sortHeader}>
      <div className={styles.sortHeaderContent}>
        <div className={styles.sortLabel} onClick={onClick}>
          <span>{children}</span>
          {!!sorter && <div className={cls} />}
        </div>
        {tips || ''}
      </div>
    </div>
  );
};

export default React.memo((props) => {
  const {
    columns,
    sorter: _sorter,
    rowKey,
    uniqueKey,
    onChange,
    loading = false,
    dataSource,
    showBody = true,
    ...otherProps
  } = props;
  const sorter = _sorter || plainObj;
  const hasData = dataSource && dataSource.length;

  const handleClick = useCallback(
    (item) => {
      if (item.sorter && onChange) {
        const columnKey = typeof rowKey === 'function' ? rowKey(item) : item.dataIndex;
        const nextOrder = getNextOrder(sorter, columnKey);
        onChange(
          nextOrder
            ? {
                columnKey,
                field: columnKey,
                order: nextOrder,
              }
            : {},
        );
      }
    },
    [onChange, sorter, rowKey],
  );

  return (
    <Spin spinning={loading}>
      <Table {...otherProps}>
        <TableHead>
          <TableRow>
            {map(columns, (item) => {
              const key = typeof rowKey === 'function' ? rowKey(item) : item.dataIndex;
              const active = item.sorter && sorter.columnKey === key;
              const order = getDirection(sorter.order);

              return (
                <TableCell
                  key={key}
                  className={styles.tableCell}
                  sortDirection={active ? order : false}
                  style={{ width: item.width }}
                  align={item.align}
                >
                  <SortLabel
                    order={order}
                    active={active}
                    sorter={item.sorter}
                    tips={item.tips}
                    onClick={() => handleClick(item)}
                  >
                    {item.title}
                  </SortLabel>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        {showBody ? (
          <TableBody>
            {hasData
              ? map(dataSource, (row, index) => (
                  <TableRow key={row[uniqueKey] || index}>
                    {map(columns, (item) => {
                      const { dataIndex, align, render } = item || {};
                      const val = row[dataIndex];
                      return (
                        <TableCell key={`${row[uniqueKey] || index}${dataIndex}`} align={align}>
                          {typeof render === 'function' ? render(val, row) : val}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              : null}
          </TableBody>
        ) : null}
      </Table>
      {!showBody || hasData || loading ? null : <Empty className={styles.empty} />}
    </Spin>
  );
});
