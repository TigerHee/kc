/**
 * Owner: Borden@kupotech.com
 */
import React, { memo, Fragment } from 'react';
import useContextSelector from '../../hooks/common/useContextSelector';

/**
 * CoinCodeToName
 */
const CoinCodeToName = (props) => {
  const { coin, ...restProps } = props;
  const currenciesMap = useContextSelector((state) => state.currenciesMap);
  const coinObj = currenciesMap[coin];
  return <Fragment {...restProps}>{coinObj?.currencyName || coin}</Fragment>;
};

export default memo(CoinCodeToName);
