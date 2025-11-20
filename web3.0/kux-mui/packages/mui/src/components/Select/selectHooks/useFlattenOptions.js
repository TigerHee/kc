/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

import { fillFieldNames, getKey } from '../aux';

const useFlattenOptions = (options) => {
  return React.useMemo(() => {
    const flattenList = [];
    const { label: fieldLabel, value: fieldValue, options: fieldOptions } = fillFieldNames();

    function dig(list, isGroupOption) {
      list.forEach((data) => {
        const label = data[fieldLabel];

        if (isGroupOption || !(fieldOptions in data)) {
          const value = data[fieldValue];
          flattenList.push({
            ...data,
            key: getKey(data, flattenList.length),
            groupOption: isGroupOption,
            value,
            label,
            title: data.title,
          });
        } else {
          let grpLabel = label;
          if (grpLabel === undefined) {
            grpLabel = data.label;
          }
          // Option Group
          flattenList.push({
            ...data,
            key: getKey(data, flattenList.length),
            group: true,
            label: grpLabel,
            title: data.title,
          });

          dig(data[fieldOptions], true);
        }
      });
    }

    dig(options, false);

    return flattenList;
  }, [options]);
};

export default useFlattenOptions;
