/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import NumberFormat from 'components/common/NumberFormat';
import { numberFixed, separateNumber, setNumToPrecision } from 'helper';
import Decimal from 'decimal.js';

const dropZero = (str) => {
  if (!str && str !== 0) return '-';
  let stringV;
  try {
    stringV = str.toString(); // 解决返回Decimal
  } catch (e) {
    stringV = str;
  }
  const e = new Decimal(stringV);
  return e.toFixed();
};

const CoinPrecision = (props) => {
  const { coin, value, coinDict, fillZero = false, fixZero } = props;
  const coinObj = coinDict[coin];
  const realValue = coinObj ? numberFixed(value, coinObj.precision) : value;
  const wrapperValue = !fixZero
    ? dropZero(realValue)
    : setNumToPrecision(realValue, coinObj?.precision);
  return (
    <React.Fragment>
      <NumberFormat>{fillZero ? realValue : wrapperValue}</NumberFormat>
    </React.Fragment>
  );
};

export default connect((state) => {
  const { categories } = state;
  return {
    coinDict: categories,
  };
})(CoinPrecision);
