/*
 * @owner: borden@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { map } from 'lodash';
import { useSelector } from 'dva';
import Select from '@mui/Select';

const IsolatedTagsSelector = (props) => {
  const isolatedSymbols = useSelector((state) => state.symbols.isolatedSymbols);

  const options = useMemo(() => {
    return map(isolatedSymbols, ({ symbol, symbolName }) => {
      return {
        value: symbol,
        label: symbolName.replace('-', '/'),
      };
    });
  }, [isolatedSymbols]);

  const onFilter = useCallback((inputVal, option) => {
    let result;
    try {
      result = [option.value, option.label].some(
        (v) => v.toLowerCase().indexOf(inputVal?.toLowerCase()) >= 0,
      );
    } catch (e) {
      result = false;
    }
    return result;
  }, []);

  return (
    <Select allowSearch options={options} searchIcon={false} filterOption={onFilter} {...props} />
  );
};

export default IsolatedTagsSelector;
