/**
 * Owner: pike@kupotech.com
 */
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { Select, styled } from '@kux/mui';
import { useMergedState } from '@kux/mui';
import CoinIcon from './CoinIcon';
import _ from 'lodash';

const EarnCoinSelector = ({ onChange, placeholder, value: valueProps, alowClear, allowSearch }) => {
  const currenciesList = useSelector((state) => state.earnAccount.currenciesList);

  const [value, setValue] = useMergedState(undefined, {
    value: valueProps,
  });

  const handleChange = useCallback(
    (v) => {
      if (valueProps === undefined) {
        setValue(v);
      }
      if (onChange) {
        onChange(v);
      }
    },
    [onChange, setValue, valueProps],
  );

  const options = React.useMemo(() => {
    return _.map(currenciesList, (currency) => {
      return {
        ...currency,
        value: currency.currency,
        label: () => {
          if (currency.currency) {
            return <CoinIcon currency={currency.currency} />;
          }
          return currency.currencyName || currency.currency;
        },
      };
    });
  }, [currenciesList]);

  const onFilter = React.useCallback((inputValue, option) => {
    let result;
    try {
      result =
        (option.currency || option.currencyName).toLowerCase().indexOf(inputValue.toLowerCase()) >=
        0;
    } catch (e) {
      result = false;
    }
    return result;
  }, []);

  return (
    <Select
      // optionLabelProp="value"
      options={options}
      filterOption={onFilter}
      onChange={handleChange}
      value={value}
      allowSearch={allowSearch}
      alowClear={alowClear}
      placeholder={placeholder}
      searchIcon={null}
    />
  );
};

export default React.memo(EarnCoinSelector);
