/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { ICSortDownOutlined, ICSortUpOutlined } from '@kux/icons';
import KeyCode from 'utils/keyCode';
import styled, { isPropValid } from 'emotion/index';
import useTheme from 'hooks/useTheme';
import Box from '../../Box';

const ASCEND = 'ascend';

const DESCEND = 'descend';

function renderColumnTitle(title, props) {
  if (typeof title === 'function') {
    return title(props);
  }

  return title;
}

function getColumnPos(index, pos) {
  return pos ? `${pos}-${index}` : `${index}`;
}

function getColumnKey(column, defaultKey) {
  if ('key' in column && column.key !== undefined && column.key !== null) {
    return column.key;
  }
  if (column.dataIndex) {
    return Array.isArray(column.dataIndex) ? column.dataIndex.join('.') : column.dataIndex;
  }

  return defaultKey;
}

function getMultiplePriority(column) {
  if (typeof column.sorter === 'object' && typeof column.sorter.multiple === 'number') {
    return column.sorter.multiple;
  }
  return false;
}

function getSortFunction(sorter) {
  if (typeof sorter === 'function') {
    return sorter;
  }
  if (sorter && typeof sorter === 'object' && sorter.compare) {
    return sorter.compare;
  }
  return false;
}

function nextSortDirection(sortDirections, current) {
  if (!current) {
    return sortDirections[0];
  }

  return sortDirections[sortDirections.indexOf(current) + 1];
}

function collectSortStates(columns, init, pos) {
  let sortStates = [];

  function pushState(column, columnPos) {
    sortStates.push({
      column,
      key: getColumnKey(column, columnPos),
      multiplePriority: getMultiplePriority(column),
      sortOrder: column?.sortOrder,
    });
  }

  (columns || []).forEach((column, index) => {
    const columnPos = getColumnPos(index, pos);

    if (column.children) {
      if ('sortOrder' in column) {
        pushState(column, columnPos);
      }
      sortStates = [...sortStates, ...collectSortStates(column.children, init, columnPos)];
    } else if (column.sorter) {
      if ('sortOrder' in column) {
        pushState(column, columnPos);
      } else if (init && column.defaultSortOrder) {
        sortStates.push({
          column,
          key: getColumnKey(column, columnPos),
          multiplePriority: getMultiplePriority(column),
          sortOrder: column?.defaultSortOrder,
        });
      }
    }
  });

  return sortStates;
}

const ToggleWrapper = styled('span')(() => {
  return {
    display: 'inline-flex',
    flexDirection: 'column',
  };
});

const StyledTriangleUpOutlined = styled(ICSortUpOutlined, {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    transform: 'translateY(2px)',
  };
});

const StyledTriangleDownOutlined = styled(ICSortDownOutlined, {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    transform: 'translateY(-4px)',
  };
});

const StyledBox = styled(Box)`
  margin-left: 2px;
  [dir='rtl'] & {
    margin-left: unset;
    margin-right: 2px;
  }
`;

function injectSorter(columns, sorterStates, triggerSorter, defaultSortDirections, theme, pos) {
  return (columns || []).map((column, index) => {
    const columnPos = getColumnPos(index, pos);
    let newColumn = column;

    if (newColumn.sorter) {
      const sortDirections = newColumn.sortDirections || defaultSortDirections;
      const columnKey = getColumnKey(newColumn, columnPos);
      const sorterState = sorterStates.find(({ key }) => key === columnKey);
      const sorterOrder = sorterState ? sorterState.sortOrder : null;
      const nextSortOrder = nextSortDirection(sortDirections, sorterOrder);
      const upNode = sortDirections.includes(ASCEND) && (
        <StyledTriangleUpOutlined
          size={12}
          color={sorterOrder === ASCEND ? theme?.colors?.primary : theme?.colors?.text24}
        />
      );
      const downNode = sortDirections.includes(DESCEND) && (
        <StyledTriangleDownOutlined
          size={12}
          color={sorterOrder === DESCEND ? theme?.colors?.primary : theme?.colors?.text24}
        />
      );

      newColumn = {
        ...newColumn,
        title: (renderProps) => {
          const renderSortTitle = (
            <Box style={{ cursor: 'pointer' }} display="inline-flex" alignItems="center">
              <span>{renderColumnTitle(column.title, renderProps)}</span>
              <StyledBox as="span">
                <ToggleWrapper>
                  {upNode}
                  {downNode}
                </ToggleWrapper>
              </StyledBox>
            </Box>
          );
          return renderSortTitle;
        },
        onHeaderCell: (col) => {
          const cell = (column.onHeaderCell && column.onHeaderCell(col)) || {};
          const originOnClick = cell.onClick;
          const originOKeyDown = cell.onKeyDown;
          cell.onClick = (event) => {
            triggerSorter({
              column,
              key: columnKey,
              sortOrder: nextSortOrder,
              multiplePriority: getMultiplePriority(column),
            });
            originOnClick?.(event);
          };
          cell.onKeyDown = (event) => {
            if (event.keyCode === KeyCode.ENTER) {
              triggerSorter({
                column,
                key: columnKey,
                sortOrder: nextSortOrder,
                multiplePriority: getMultiplePriority(column),
              });
              originOKeyDown?.(event);
            }
          };

          if (sorterOrder) {
            if (sorterOrder === 'ascend') {
              cell['aria-sort'] = 'ascending';
            } else {
              cell['aria-sort'] = 'descending';
            }
          }

          cell.tabIndex = 0;

          return cell;
        },
      };
    }

    if ('children' in newColumn) {
      newColumn = {
        ...newColumn,
        children: injectSorter(
          newColumn.children,
          sorterStates,
          triggerSorter,
          defaultSortDirections,
          columnPos,
        ),
      };
    }

    return newColumn;
  });
}

function stateToInfo(sorterStates) {
  const { column, sortOrder } = sorterStates;
  return { column, order: sortOrder, field: column.dataIndex, columnKey: column.key };
}

function generateSorterInfo(sorterStates) {
  const list = sorterStates.filter(({ sortOrder }) => sortOrder).map(stateToInfo);

  if (list.length === 0 && sorterStates.length) {
    return {
      ...stateToInfo(sorterStates[sorterStates.length - 1]),
      column: undefined,
    };
  }

  return list[0] || {};
}

export function getSortData(data, sortStates, childrenColumnName) {
  const innerSorterStates = sortStates
    .slice()
    .sort((a, b) => b.multiplePriority - a.multiplePriority);

  const cloneData = data.slice();

  const runningSorters = innerSorterStates.filter(
    ({ column: { sorter }, sortOrder }) => getSortFunction(sorter) && sortOrder,
  );

  if (!runningSorters.length) {
    return cloneData;
  }

  return cloneData
    .sort((record1, record2) => {
      for (let i = 0; i < runningSorters.length; i += 1) {
        const sorterState = runningSorters[i];
        const {
          column: { sorter },
          sortOrder,
        } = sorterState;

        const compareFn = getSortFunction(sorter);

        if (compareFn && sortOrder) {
          const compareResult = compareFn(record1, record2, sortOrder);

          if (compareResult !== 0) {
            return sortOrder === ASCEND ? compareResult : -compareResult;
          }
        }
      }

      return 0;
    })
    .map((record) => {
      const subRecords = record[childrenColumnName];
      if (subRecords) {
        return {
          ...record,
          [childrenColumnName]: getSortData(subRecords, sortStates, childrenColumnName),
        };
      }
      return record;
    });
}

export default function useSort({ mergedColumns, onSorterChange, sortDirections }) {
  const theme = useTheme();

  const [sortStates, setSortStates] = React.useState(collectSortStates(mergedColumns, true));

  const mergedSorterStates = React.useMemo(() => {
    let validate = true;
    const collectedStates = collectSortStates(mergedColumns, false);

    if (!collectedStates.length) {
      return sortStates;
    }

    const validateStates = [];

    function patchStates(state) {
      if (validate) {
        validateStates.push(state);
      } else {
        validateStates.push({
          ...state,
          sortOrder: null,
        });
      }
    }

    let multipleMode = null;
    collectedStates.forEach((state) => {
      if (multipleMode === null) {
        patchStates(state);

        if (state.sortOrder) {
          if (state.multiplePriority === false) {
            validate = false;
          } else {
            multipleMode = true;
          }
        }
      } else if (multipleMode && state.multiplePriority !== false) {
        patchStates(state);
      } else {
        validate = false;
        patchStates(state);
      }
    });

    return validateStates;
  }, [mergedColumns, sortStates]);

  const columnTitleSorterProps = React.useMemo(() => {
    const sortColumns = mergedSorterStates.map(({ column, sortOrder }) => ({
      column,
      order: sortOrder,
    }));

    return {
      sortColumns,
      sortColumn: sortColumns[0] && sortColumns[0].column,
      sortOrder: sortColumns[0] && sortColumns[0].order,
    };
  }, [mergedSorterStates]);

  function triggerSorter(sortState) {
    let newSorterStates;

    if (
      sortState.multiplePriority === false ||
      !mergedSorterStates.length ||
      mergedSorterStates[0].multiplePriority === false
    ) {
      newSorterStates = [sortState];
    } else {
      newSorterStates = [
        ...mergedSorterStates.filter(({ key }) => key !== sortState.key),
        sortState,
      ];
    }

    setSortStates(newSorterStates);
    onSorterChange(generateSorterInfo(newSorterStates), newSorterStates);
  }

  const transformColumns = (innerColumns) =>
    injectSorter(innerColumns, mergedSorterStates, triggerSorter, sortDirections, theme);

  const getSorters = () => generateSorterInfo(mergedSorterStates);

  return [transformColumns, mergedSorterStates, columnTitleSorterProps, getSorters];
}
