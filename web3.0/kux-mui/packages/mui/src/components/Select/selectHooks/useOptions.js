/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

const useOptions = (options) => {
  return React.useMemo(() => {
    const mergedOptions = options;

    const valueOptions = new Map();

    function covert(optionList, isChildren = false) {
      for (let i = 0; i < optionList.length; i += 1) {
        const option = optionList[i];
        if (!option.options || isChildren) {
          valueOptions.set(option.value, option);
        } else {
          covert(option.options, true);
        }
      }
    }
    covert(mergedOptions);

    return {
      options: mergedOptions,
      valueOptions,
    };
  }, [options]);
};

export default useOptions;
