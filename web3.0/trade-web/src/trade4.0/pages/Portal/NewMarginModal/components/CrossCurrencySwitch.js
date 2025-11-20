/*
 * @owner: borden@kupotech.com
 */
import React, { useMemo, forwardRef, useImperativeHandle } from 'react';
import { sortBy } from 'lodash';
import useRequest from '@/hooks/common/useRequest';
import CoinSelector from '@/components/CoinSelector';
import { getMarginLoanAbleDetail } from 'src/services/margin';

const CrossCurrencySwitch = forwardRef(({ open, sortor, ...otherProps }, ref) => {
  const { key, displayKey, label = () => '' } = sortor || {};

  const {
    loading,
    refresh,
    data: currencies,
  } = useRequest(getMarginLoanAbleDetail, {
    ready: Boolean(open),
    cacheKey: 'marginLoanAbleDetail',
    formatResult: (v) => v?.data?.fundsInfoList,
  });

  useImperativeHandle(ref, () => ({
    refresh,
  }));

  const list = useMemo(() => {
    const result = key ? sortBy(currencies, (v) => -v[key]) : currencies;
    return result;
  }, [currencies, key]);

  return (
    <CoinSelector
      showIcon
      searchIcon={false}
      showOptionsTitle
      allowClear={false}
      loading={loading}
      currencies={list}
      style={{ width: '100%' }}
      amountConfig={{
        label: label(),
        key: displayKey,
      }}
      {...otherProps}
    />
  );
});

export default CrossCurrencySwitch;
