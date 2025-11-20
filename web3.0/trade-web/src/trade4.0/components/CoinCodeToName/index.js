/**
 * Owner: Ray.Lee@kupotech.com
 */
import { useSelector } from 'dva';
import React, { memo, Fragment } from 'react';

/**
 * CoinCodeToName
 */
const CoinCodeToName = (props) => {
  const { coin, ...restProps } = props;
  const coinDict = useSelector((state) => state.categories);
  const coinObj = coinDict[coin];
  return (
    <Fragment {...restProps}>{coinObj ? coinObj.currencyName : coin}</Fragment>
  );
};

export default memo(CoinCodeToName);
