/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useState, useEffect } from 'react';
import Select from '@mui/Select';
import { useSelector } from 'dva';
import { forEach } from 'lodash';

/**
 * SymbolSelect
 */
const SymbolSelect = (props) => {
  const { ...restProps } = props;
  const symbolsMap = useSelector((state) => state.symbols.symbolsMap);
  const [options, setOptions] = useState([]);

  const getOptions = () => {
    const ops = [];
    forEach(symbolsMap, (item) => {
      const displayName = (item.symbol || '').replace('-', ' / ');
      ops.push({
        value: item.code,
        label: displayName,
        title: displayName,
      });
    });
    setOptions(ops || []);
  };

  useEffect(() => {
    getOptions();
  }, [symbolsMap]);

  return (
    <Select
      allowSearch
      searchIcon={false}
      emptyContent
      options={options}
      size="xlarge"
      {...restProps}
    />
  );
};

export default memo(SymbolSelect);
