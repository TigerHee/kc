/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { connect } from 'dva';
import { numberFixed, separateNumber } from 'helper';
import BeautifulNumber from 'components/numberic/BeautifulNumber';
import Decimal from 'decimal.js';

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
  } else if (obj.quoteCurrency === coin) {
    return 'pricePrecision';
  }
};

const SymbolPrecision = (props) => {
  const { symbol, value, symbols, fillZero = false, precisionKey, coin,
    isBeautifulNumber = false } = props;
  const symbolObj = symbols.find(s => s.code === symbol);
  if (symbolObj == null) {
    return <React.Fragment>{Decimal.isDecimal(value) ? value.toFixed() : value }</React.Fragment>;
  }
  const _key = getKey(symbolObj, precisionKey, coin);
  const realValue = symbolObj ? numberFixed(value, symbolObj[_key]) : value;
  const minValue = new Decimal(10).pow(-symbolObj[_key]).toFixed();

  const absValue = Math.abs(value);
  if (absValue < minValue && absValue > 0) {
    return (
      <React.Fragment>
        { `${value > 0 ? '< ' : '> -'}${minValue}` }
      </React.Fragment>
    );
  }
  if (isBeautifulNumber) {
    return (
      <BeautifulNumber>
        {fillZero ? separateNumber(realValue) : separateNumber(dropZero(realValue))}
      </BeautifulNumber>
    );
  } else {
    return (
      <React.Fragment>
        {fillZero ? separateNumber(realValue) : separateNumber(dropZero(realValue))}
      </React.Fragment>
    );
  }
};

export default connect((state) => {
  const symbols = state.symbols.symbols;
  return {
    symbols,
  };
})(SymbolPrecision);
