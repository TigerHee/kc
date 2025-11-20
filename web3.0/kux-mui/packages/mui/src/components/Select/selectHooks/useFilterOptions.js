/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { toArray } from '../aux';

function includes(test, search) {
  return toArray(test)
    .join('')
    .toUpperCase()
    .includes(search);
}
const useFilterOptions = (options, searchValue, filterOption, fieldNames, optionFilterProp) => {
  return React.useMemo(() => {
    if (!searchValue || filterOption === false) {
      return options;
    }
    if (!options.length) {
      return [];
    }
    const filteredOptions = [];
    const { options: fieldOptions, label: fieldLabel, value: fieldValue } = fieldNames;
    const customizeFilter = typeof filterOption === 'function';
    const upperSearch = searchValue.toUpperCase();
    const filterFunc = customizeFilter
      ? filterOption
      : (_, option) => {
          if (optionFilterProp) {
            return includes(option[optionFilterProp], upperSearch);
          }

          if (option[fieldOptions]) {
            return includes(option[fieldLabel], upperSearch);
          }
          return includes(option[fieldValue], upperSearch);
        };

    options.forEach((item) => {
      if (item[fieldOptions]) {
        const matchGroup = filterFunc(searchValue, item);
        if (matchGroup) {
          filteredOptions.push(item);
        } else {
          const subOptions = item[fieldOptions].filter((subItem) =>
            filterFunc(searchValue, subItem),
          );
          if (subOptions.length) {
            filteredOptions.push({
              ...item,
              [fieldOptions]: subOptions,
            });
          }
        }

        return;
      }

      if (filterFunc(searchValue, item)) {
        filteredOptions.push(item);
      }
    });

    return filteredOptions;
  }, [fieldNames, filterOption, optionFilterProp, options, searchValue]);
};

export default useFilterOptions;
