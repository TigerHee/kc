/**
 * Owner: solar@kupotech.com
 */
import React from 'react';
import Big from 'bignumber.js';
import { useStateSelector } from '../../hooks/useStateSelector';
import NumberFormat from '../NumberFormat';
import numberFixed from '../../utils/numberFixed';
import setNumToPrecision from '../../utils/setNumToPrecision';

const dropZero = (str) => {
  if (!str && str !== 0) return '-';
  let stringV;
  try {
    stringV = str.toString();
  } catch (e) {
    stringV = str;
  }
  const e = new Big(stringV);
  return e.toFixed();
};

const CoinPrecision = (props) => {
  const { coin, value, coinDict, fillZero = false, fixZero } = props;
  const coinObj = coinDict[coin];
  const realValue = coinObj ? numberFixed(value, coinObj.precision) : value;
  const wrapperValue = !fixZero
    ? dropZero(realValue)
    : setNumToPrecision(realValue, coinObj?.precision);
  return <NumberFormat>{fillZero ? realValue : wrapperValue}</NumberFormat>;
};

export default (props) => {
  const categories = useStateSelector('categories');
  return <CoinPrecision coinDict={categories} {...props} />;
};
