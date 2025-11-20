/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

function flatRecord(record, indent, childrenColumnName, expandedKeys, getRowKey, index) {
  const arr = [];

  arr.push({
    record,
    indent,
    index,
  });

  const key = getRowKey(record);

  const expanded = expandedKeys?.has(key);

  if (record && Array.isArray(record[childrenColumnName]) && expanded) {
    for (let i = 0; i < record[childrenColumnName].length; i += 1) {
      const tempArr = flatRecord(
        record[childrenColumnName][i],
        indent + 1,
        childrenColumnName,
        expandedKeys,
        getRowKey,
        i,
      );

      arr.push(...tempArr);
    }
  }

  return arr;
}

export default function useFlattenRecords(data, childrenColumnName, expandedKeys, getRowKey) {
  const arr = React.useMemo(() => {
    if (expandedKeys?.size) {
      const temp = [];

      // collect flattened record
      for (let i = 0; i < data?.length; i += 1) {
        const record = data[i];

        temp.push(...flatRecord(record, 0, childrenColumnName, expandedKeys, getRowKey, i));
      }

      return temp;
    }

    return data?.map((item, index) => {
      return {
        record: item,
        indent: 0,
        index,
      };
    });
  }, [data, childrenColumnName, expandedKeys, getRowKey]);

  return arr;
}
