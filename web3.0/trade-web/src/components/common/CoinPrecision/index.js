/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { connect } from 'dva';
import { numberFixed, separateNumber } from 'helper';
import Decimal from 'decimal.js';

const dropZero = (str) => {
  if (isNaN(Number(str))) return str;
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
  const categories = state.categories;
  return {
    coinDict: categories,
  };
})(CoinPrecision);
