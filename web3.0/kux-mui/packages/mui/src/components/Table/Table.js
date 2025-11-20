/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/index';
import useResponsive from 'hooks/useResponsive';
import warning from 'utils/warning';
import clsx from 'clsx';
import MTable from './MTable';
import Spin from '../Spin';
import Pagination from '../Pagination';
import { renderExpandIcon } from './aux';
import useLazyKVMap from './tableHooks/useLazyKVMap';
import useSelection from './tableHooks/useSelection';
import useSort, { getSortData } from './tableHooks/useSort';
import useTitleColumns from './tableHooks/useTitleColumns';
import useMergedPagination, { getPaginationParam } from './tableHooks/useMergedPagination';
import Container from './Container';
import useClassNames from './useClassNames';

const Wrapper = styled(Container)`
  clear: both;
  max-width: 100%;
  position: relative;
  &::before {
    display: table;
    content: '';
  }
  &::after {
    display: table;
    clear: both;
    content: '';
  }
`;

const EMPTY_LIST = [];

const PaginationBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Table = React.forwardRef((props, ref) => {
  const {
    loading = false,
    pagination,
    onChange,
    dataSource,
    locale,
    columns,
    rowKey,
    expandable,
    rowSelection,
    sortDirections,
    className,
    ...others
  } = props;
  const _classNames = useClassNames();
  const [direction, setDirection] = useState('ltr');

  // ============================= Data =============================
  const mergedData = dataSource || EMPTY_LIST;

  // ============================ responsive =============================

  const needResponsive = React.useMemo(() => columns.some((col) => col.responsive), [columns]);

  const screens = useResponsive();

  const mergedColumns = React.useMemo(() => {
    if (needResponsive) {
      const matched = new Set(Object.keys(screens).filter((m) => screens[m]));

      return columns.filter((c) => !c.responsive || c.responsive.some((r) => matched.has(r)));
    }
    return columns;
  }, [columns, needResponsive, screens]);

  // ============================ direction =============================
  useEffect(() => {
    const _direction = document.querySelector('html').dir || 'ltr';
    setDirection(_direction);
  }, []);

  // ============================ events =============================
  const changeEventInfo = {};

  const triggerOnChange = (info, action) => {
    const changeInfo = {
      ...changeEventInfo,
      ...info,
    };

    if (onChange) {
      onChange(changeInfo.pagination, changeInfo.filters, changeInfo.sorter, {}, action);
    }
  };

  const onPaginationChange = (current, pageSize) => {
    triggerOnChange(
      {
        pagination: { ...changeEventInfo.pagination, current, pageSize },
      },
      'paginate',
    );
  };

  const [mergedPagination] = useMergedPagination(pagination, onPaginationChange);

  changeEventInfo.pagination =
    pagination === false ? {} : getPaginationParam(pagination, mergedPagination);

  const getRowKey = React.useMemo(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record) => {
      const key = record && record[rowKey];
      warning(
        key !== undefined,
        'Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.',
      );
      return key;
    };
  }, [rowKey]);

  // ====================== Expand ======================
  const mergedExpandable = {
    ...expandable,
    showExpandColumn: true,
    fixed: false,
    defaultExpandAllRows: false,
  };

  mergedExpandable.expandIcon = mergedExpandable.expandIcon || renderExpandIcon;

  mergedExpandable.childrenColumnName = mergedExpandable.childrenColumnName || 'children';

  const { expandedRowRender, childrenColumnName } = mergedExpandable;

  const expandableType = React.useMemo(() => {
    if (expandedRowRender) {
      return 'row';
    }
    if (
      expandable ||
      mergedData.some(
        (record) => record && typeof record === 'object' && record[childrenColumnName],
      )
    ) {
      return 'nest';
    }
    return false;
  }, [expandedRowRender, expandable, mergedData, childrenColumnName]);

  mergedExpandable.expandableType = expandableType;

  if (expandableType === 'nest' && mergedExpandable.expandIconColumnIndex === undefined) {
    mergedExpandable.expandIconColumnIndex = rowSelection ? 1 : 0;
  } else if (mergedExpandable.expandIconColumnIndex > 0 && rowSelection) {
    mergedExpandable.expandIconColumnIndex -= 1;
  }

  // ============================ Sorter =============================
  const onSorterChange = (sorter, sorterStates) => {
    triggerOnChange(
      {
        sorter,
        sorterStates,
      },
      'sort',
      false,
    );
  };
  const [transformSorterColumns, sortStates, sorterTitleProps, getSorters] = useSort({
    mergedColumns,
    onSorterChange,
    sortDirections: sortDirections || ['ascend', 'descend'],
  });
  const sortedData = React.useMemo(() => getSortData(mergedData, sortStates, childrenColumnName), [
    childrenColumnName,
    mergedData,
    sortStates,
  ]);

  changeEventInfo.sorter = getSorters();
  changeEventInfo.sorterStates = sortStates;

  // ============================ Column ============================
  const columnTitleProps = React.useMemo(
    () => ({
      ...sorterTitleProps,
    }),
    [sorterTitleProps],
  );
  const [transformTitleColumns] = useTitleColumns(columnTitleProps);

  // ========================== Selections ==========================

  const [getRecordByKey] = useLazyKVMap(mergedData, childrenColumnName, getRowKey);

  const [transformSelectionColumns] = useSelection(rowSelection, {
    getRowKey,
    getRecordByKey,
    data: mergedData,
    expandableType,
    childrenColumnName,
  });

  const transformColumns = React.useCallback(
    (innerColumns) => {
      return transformTitleColumns(transformSelectionColumns(transformSorterColumns(innerColumns)));
    },
    [transformSelectionColumns, transformSorterColumns, transformTitleColumns],
  );

  return (
    <Spin spinning={loading} size="small">
      <Wrapper ref={ref} className={clsx(_classNames.root, className)}>
        <MTable
          {...others}
          direction={others.direction || direction}
          expandable={mergedExpandable}
          getRowKey={getRowKey}
          columns={mergedColumns}
          data={sortedData}
          locale={locale}
          transformColumns={transformColumns}
        />
        {pagination ? (
          <PaginationBox>
            <Pagination {...mergedPagination} />
          </PaginationBox>
        ) : null}
      </Wrapper>
    </Spin>
  );
});

Table.displayName = 'Table';

Table.propTypes = {
  columns: PropTypes.array,
  size: PropTypes.oneOf(['small', 'basic']),
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  expandable: PropTypes.object,
  showHeader: PropTypes.bool,
  bordered: PropTypes.bool,
  headerBorder: PropTypes.bool,
  headerType: PropTypes.oneOf(['transparent', 'filled']),
  components: PropTypes.object,
  locale: PropTypes.object,
};

Table.defaultProps = {
  columns: [],
  dataSource: [],
  size: 'basic',
  loading: false,
  pagination: false,
  rowKey: 'key',
  showHeader: true,
  bordered: false,
  headerBorder: false,
  headerType: 'transparent',
  locale: {},
};

export default Table;
