/**
 * Owner: garuda@kupotech.com
 * Price Form 控件 props
 */
import React, { useCallback } from 'react';

import { get } from 'lodash';

import Form from '@mui/Form';

import {
  _t,
  getStore,
  toNonExponential,
  thousandPointed,
  lessThanOrEqualTo,
  greaterThan,
} from '../../builtinCommon';

import { useGetIsLogin, useGetSymbolInfo } from '../../hooks/useGetData';

const { useFormInstance } = Form;

const noop = () => {};
const usePriceFieldProps = ({ name, onPriceChange = noop }) => {
  const form = useFormInstance();
  const { symbolInfo } = useGetSymbolInfo();
  const isLogin = useGetIsLogin();

  const validator = React.useCallback(
    (__, value) => {
      onPriceChange(value);
      if (!value) {
        return Promise.reject(_t('input.price.error'));
      }

      if (lessThanOrEqualTo(value)(0) || greaterThan(value)(symbolInfo.maxPrice)) {
        return Promise.reject(
          _t('calc.input.error.price', { price: thousandPointed(symbolInfo.maxPrice) }),
        );
      }

      return Promise.resolve();
    },
    [symbolInfo.maxPrice, onPriceChange],
  );

  const handleChangePrice = useCallback(() => {
    const globalState = getStore().getState();
    const lastPrice = get(globalState, 'futuresForm.lastPrice');
    form.setFieldsValue({ [name]: toNonExponential(lastPrice) });
    // 不需要监控 form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return {
    validator,
    handleChangePrice,
    isLogin,
    symbolInfo,
  };
};

export default usePriceFieldProps;
