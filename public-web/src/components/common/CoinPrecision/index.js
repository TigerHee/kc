/**
 * Owner: willen@kupotech.com
 */
import Decimal from 'decimal.js';
import { numberFixed, separateNumber } from 'helper';
import React from 'react';
import { connect } from 'react-redux';

const dropZero = (str) => {
  if (!str) return '-';
  const e = new Decimal(str);
  return e.toFixed();
};

const CoinPrecision = (props) => {
  const { coin, value, coinDict, fillZero = false } = props;
  const coinObj = coinDict[coin];
  const realValue = coinObj ? numberFixed(value, coinObj.precision) : value;
  return (
    <React.Fragment>
      {fillZero ? separateNumber(realValue) : separateNumber(dropZero(realValue))}
    </React.Fragment>
  );
};

export default connect((state) => {
  const { categories } = state;
  return {
    coinDict: categories,
  };
})(CoinPrecision);
