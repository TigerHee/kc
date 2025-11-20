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

const getKey = (obj, key, coin) => {
  if (key) {
    return key;
  }
  if (obj.baseCurrency === coin) {
    return 'basePrecision';
  }
  if (obj.quoteCurrency === coin) {
    return 'pricePrecision';
  }
};

const SymbolPrecision = (props) => {
  const { symbol, value, symbols, fillZero = false, precisionKey, coin } = props;
  const symbolObj = symbols.find((s) => s.code === symbol);
  if (symbolObj == null) {
    return <React.Fragment>{value}</React.Fragment>;
  }
  const _key = getKey(symbolObj, precisionKey, coin);
  const realValue = symbolObj ? numberFixed(value, symbolObj[_key]) : value;
  const minValue = new Decimal(10).pow(-symbolObj[_key]).toFixed();

  const absValue = Math.abs(value);
  if (absValue < minValue && absValue > 0) {
    return <React.Fragment>{`${value > 0 ? '< ' : '> -'}${minValue}`}</React.Fragment>;
  }
  return (
    <React.Fragment>
      {fillZero ? separateNumber(realValue) : separateNumber(dropZero(realValue))}
    </React.Fragment>
  );
};

export default connect((state) => {
  const symbols = state.market.allRecords;
  return {
    symbols,
  };
})(SymbolPrecision);
