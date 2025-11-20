/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import useMergedState from 'hooks/useMergedState';
import Checkbox from '../../Checkbox';
import { SELECTION_COLUMN, INTERNAL_KEY_PREFIX } from '../aux';

const EMPTY_LIST = [];

function arrDel(list, value) {
  if (!list) return [];
  const clone = list.slice();
  const index = clone.indexOf(value);
  if (index >= 0) {
    clone.splice(index, 1);
  }
  return clone;
}

function arrAdd(list, value) {
  const clone = (list || []).slice();
  if (clone.indexOf(value) === -1) {
    clone.push(value);
  }
  return clone;
}

function flattenData(data, childrenColumnName) {
  let list = [];
  (data || []).forEach((record) => {
    list.push(record);

    if (record && typeof record === 'object' && childrenColumnName in record) {
      list = [...list, ...flattenData(record[childrenColumnName], childrenColumnName)];
    }
  });

  return list;
}

export default (rowSelection, config) => {
  const {
    columnTitle,
    columnWidth,
    hideSelectAll,
    getCheckboxProps,
    selectedRowKeys,
    defaultSelectedRowKeys,
    onChange: onSelectionChange,
    onSelect,
    fixed,
    onSelectAll,
  } = rowSelection || {};

  const { data, getRecordByKey, getRowKey, expandableType, childrenColumnName } = config;

  // ========================= Keys =========================
  const [mergedSelectedKeys, setMergedSelectedKeys] = useMergedState(
    selectedRowKeys || defaultSelectedRowKeys || EMPTY_LIST,
    {
      value: selectedRowKeys,
    },
  );

  // Get flatten data
  const flattedData = React.useMemo(() => flattenData(data, childrenColumnName), [
    data,
    childrenColumnName,
  ]);

  // Get all checkbox props
  const checkboxPropsMap = React.useMemo(() => {
    const map = new Map();
    flattedData.forEach((record, index) => {
      const key = getRowKey(record, index);
      const checkboxProps = (getCheckboxProps ? getCheckboxProps(record) : null) || {};
      map.set(key, checkboxProps);
    });
    return map;
  }, [flattedData, getRowKey, getCheckboxProps]);

  const [derivedSelectedKeys, derivedHalfSelectedKeys] = React.useMemo(() => {
    return [mergedSelectedKeys || [], []];
  }, [mergedSelectedKeys]);

  const derivedSelectedKeySet = React.useMemo(() => {
    const keys = derivedSelectedKeys;
    return new Set(keys);
  }, [derivedSelectedKeys]);

  const derivedHalfSelectedKeySet = React.useMemo(() => new Set(derivedHalfSelectedKeys), [
    derivedHalfSelectedKeys,
  ]);

  const [lastSelectedKey, setLastSelectedKey] = React.useState(null);

  // Reset if rowSelection reset
  React.useEffect(() => {
    if (!rowSelection) {
      setMergedSelectedKeys(EMPTY_LIST);
    }
  }, [rowSelection, setMergedSelectedKeys]);

  const setSelectedKeys = React.useCallback(
    (keys) => {
      const availableKeys = [];
      const records = [];

      keys.forEach((key) => {
        const record = getRecordByKey(key);
        if (record !== undefined) {
          availableKeys.push(key);
          records.push(record);
        }
      });

      setMergedSelectedKeys(availableKeys);

      onSelectionChange?.(availableKeys, records);
    },
    [setMergedSelectedKeys, onSelectionChange, getRecordByKey],
  );

  // ====================== Selections ======================

  // Trigger single `onSelect` event
  const triggerSingleSelection = React.useCallback(
    (key, selected, keys, event) => {
      if (onSelect) {
        const rows = keys.map((k) => getRecordByKey(k));
        onSelect(getRecordByKey(key), selected, rows, event);
      }

      setSelectedKeys(keys);
    },
    [onSelect, getRecordByKey, setSelectedKeys],
  );

  // ======================= Columns ========================

  const transformColumns = React.useCallback(
    (columns) => {
      if (!rowSelection) {
        return columns.filter((column) => column !== SELECTION_COLUMN);
      }
      let cloneColumns = [...columns];
      const keySet = new Set(derivedSelectedKeySet);
      // Record key only need check with enabled
      const recordKeys = flattedData
        .map(getRowKey)
        .filter((key) => !checkboxPropsMap.get(key).disabled);

      const checkedCurrentAll = recordKeys.every((key) => keySet.has(key));

      const checkedCurrentSome = recordKeys.some((key) => keySet.has(key));

      const onSelectAllChange = () => {
        const changeKeys = [];

        if (checkedCurrentAll) {
          recordKeys.forEach((key) => {
            keySet.delete(key);
            changeKeys.push(key);
          });
        } else {
          recordKeys.forEach((key) => {
            if (!keySet.has(key)) {
              keySet.add(key);
              changeKeys.push(key);
            }
          });
        }

        const keys = Array.from(keySet);

        onSelectAll?.(
          !checkedCurrentAll,
          keys.map((k) => getRecordByKey(k)),
          changeKeys.map((k) => getRecordByKey(k)),
        );

        setSelectedKeys(keys);
      };

      const allDisabledData = flattedData
        .map((record, index) => {
          const key = getRowKey(record, index);
          const checkboxProps = checkboxPropsMap.get(key) || {};
          return { checked: keySet.has(key), ...checkboxProps };
        })
        .filter(({ disabled }) => disabled);

      const allDisabled = !!allDisabledData.length && allDisabledData.length === flattedData.length;

      const allDisabledAndChecked = allDisabled && allDisabledData.every(({ checked }) => checked);
      const allDisabledSomeChecked = allDisabled && allDisabledData.some(({ checked }) => checked);

      const title = !hideSelectAll ? (
        <Checkbox
          checked={!allDisabled ? !!flattedData.length && checkedCurrentAll : allDisabledAndChecked}
          indeterminate={
            !allDisabled
              ? !checkedCurrentAll && checkedCurrentSome
              : !allDisabledAndChecked && allDisabledSomeChecked
          }
          onChange={onSelectAllChange}
          disabled={flattedData.length === 0 || allDisabled}
        />
      ) : null;

      const renderCell = (_, record, index) => {
        const key = getRowKey(record, index);
        const checked = keySet.has(key);
        const indeterminate = derivedHalfSelectedKeySet.has(key);
        const checkboxProps = checkboxPropsMap.get(key);
        let mergedIndeterminate;
        if (expandableType === 'nest') {
          mergedIndeterminate = indeterminate;
        } else {
          mergedIndeterminate = checkboxProps?.indeterminate ?? indeterminate;
        }

        const node = (
          <Checkbox
            {...checkboxProps}
            indeterminate={mergedIndeterminate}
            checked={checked}
            onClick={(e) => e.stopPropagation()}
            onChange={({ nativeEvent }) => {
              const { shiftKey } = nativeEvent;

              let startIndex = -1;
              let endIndex = -1;

              if (shiftKey) {
                const pointKeys = new Set([lastSelectedKey, key]);

                recordKeys.some((recordKey, recordIndex) => {
                  if (pointKeys.has(recordKey)) {
                    if (startIndex === -1) {
                      startIndex = recordIndex;
                    } else {
                      endIndex = recordIndex;
                      return true;
                    }
                  }

                  return false;
                });
              }

              if (endIndex !== -1 && startIndex !== endIndex) {
                const rangeKeys = recordKeys.slice(startIndex, endIndex + 1);
                const changedKeys = [];

                if (checked) {
                  rangeKeys.forEach((recordKey) => {
                    if (keySet.has(recordKey)) {
                      changedKeys.push(recordKey);
                      keySet.delete(recordKey);
                    }
                  });
                } else {
                  rangeKeys.forEach((recordKey) => {
                    if (!keySet.has(recordKey)) {
                      changedKeys.push(recordKey);
                      keySet.add(recordKey);
                    }
                  });
                }

                const keys = Array.from(keySet);

                setSelectedKeys(keys);
              } else {
                // Single record selected
                const originCheckedKeys = derivedSelectedKeys;
                const checkedKeys = checked
                  ? arrDel(originCheckedKeys, key)
                  : arrAdd(originCheckedKeys, key);
                triggerSingleSelection(key, !checked, checkedKeys, nativeEvent);
              }
              setLastSelectedKey(key);
            }}
          />
        );
        return node;
      };

      if (!cloneColumns.includes(SELECTION_COLUMN)) {
        if (
          cloneColumns.findIndex(
            (col) => col[INTERNAL_KEY_PREFIX]?.columnType === 'EXPAND_COLUMN',
          ) === 0
        ) {
          const [expandColumn, ...restColumns] = cloneColumns;
          cloneColumns = [expandColumn, SELECTION_COLUMN, ...restColumns];
        } else {
          cloneColumns = [SELECTION_COLUMN, ...cloneColumns];
        }
      }

      const selectionColumnIndex = cloneColumns.indexOf(SELECTION_COLUMN);

      cloneColumns = cloneColumns.filter(
        (column, index) => column !== SELECTION_COLUMN || index === selectionColumnIndex,
      );

      // Fixed column logic
      const prevCol = cloneColumns[selectionColumnIndex - 1];
      const nextCol = cloneColumns[selectionColumnIndex + 1];

      let mergedFixed = fixed;

      if (mergedFixed === undefined) {
        if (nextCol?.fixed !== undefined) {
          mergedFixed = nextCol.fixed;
        } else if (prevCol?.fixed !== undefined) {
          mergedFixed = prevCol.fixed;
        }
      }

      if (mergedFixed && prevCol && prevCol.fixed === undefined) {
        prevCol.fixed = mergedFixed;
      }

      const selectionColumn = {
        [INTERNAL_KEY_PREFIX]: {
          columnType: 'SELECTION_COLUMN',
        },
        fixed: mergedFixed,
        width: columnWidth || '44px',
        title: columnTitle || title,
        render: renderCell,
      };

      return cloneColumns.map((col) => (col === SELECTION_COLUMN ? selectionColumn : col));
    },
    [
      checkboxPropsMap,
      columnTitle,
      columnWidth,
      derivedHalfSelectedKeySet,
      derivedSelectedKeySet,
      derivedSelectedKeys,
      expandableType,
      fixed,
      flattedData,
      getRecordByKey,
      getRowKey,
      hideSelectAll,
      lastSelectedKey,
      onSelectAll,
      rowSelection,
      setSelectedKeys,
      triggerSingleSelection,
    ],
  );
  return [transformColumns, derivedSelectedKeySet];
};
