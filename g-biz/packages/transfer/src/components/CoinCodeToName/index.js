/**
 * Owner: solar@kupotech.com
 */
import React from 'react';
import { useStateSelector } from '../../hooks/useStateSelector';

const CoinCodeToName = (props) => {
  const { coinDict, coin } = props;
  const coinObj = coinDict[coin];
  return <>{coinObj ? coinObj.currencyName : coin}</>;
};

export default (props) => {
  const categories = useStateSelector('categories');
  return <CoinCodeToName coinDict={categories} {...props} />;
};
