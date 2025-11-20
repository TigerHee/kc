/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { numberFormat } from '@kux/mui';
import Decimal from 'decimal.js';
import { numberFixed, setNumToPrecision } from 'helper';
import React from 'react';
import { connect } from 'react-redux';

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
  const { currentLang } = useLocale();
  const realValue = coinObj ? numberFixed(value, coinObj.precision) : value;
  const wrapperValue = !fixZero
    ? dropZero(realValue)
    : setNumToPrecision(realValue, coinObj?.precision);
  return (
    <React.Fragment>
      {numberFormat({
        number: fillZero ? realValue : wrapperValue,
        lang: currentLang,
      })}
    </React.Fragment>
  );
};

export default connect((state) => {
  const { categories } = state;
  return {
    coinDict: categories,
  };
})(CoinPrecision);
