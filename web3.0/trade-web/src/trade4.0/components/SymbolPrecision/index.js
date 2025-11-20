/**
 * Owner: borden@kupotech.com
 */
import React, { memo } from 'react';
import { useSelector } from 'dva';
import { numberFixed } from 'helper';
import { formatNumber, dropZero } from '@/utils/format';
// import BeautifulNumber from '@/components/BeautifulNumber';
import Decimal from 'decimal.js';

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
  const {
    symbol,
    value,
    fillZero = false,
    precisionKey,
    coin,
    stopMark = false,
    // isBeautifulNumber = false,
  } = props;

  const symbols = useSelector((state) => state.symbols.symbols);

  const symbolObj = symbols.find((s) => s.code === symbol);
  if (symbolObj == null) {
    return <React.Fragment>{Decimal.isDecimal(value) ? value.toFixed() : value}</React.Fragment>;
  }
  const _key = getKey(symbolObj, precisionKey, coin);
  const realValue = symbolObj ? numberFixed(value, symbolObj[_key]) : value;
  const minValue = new Decimal(10).pow(-symbolObj[_key]).toFixed();

  const absValue = Math.abs(value);
  if (absValue < minValue && absValue > 0) {
    if (stopMark) {
      return <React.Fragment>{`${dropZero(value)}`}</React.Fragment>;
    } else {
      return <React.Fragment>{`${value > 0 ? '< ' : '> -'}${minValue}`}</React.Fragment>;
    }
  }
  // isBeautifulNumber 没有用到，现在设计也不存在同一个数字两种样式
  // if (isBeautifulNumber) {
  //   return (
  //     <BeautifulNumber>
  //       {fillZero
  //         ? separateNumber(realValue)
  //         : separateNumber(dropZero(realValue))}
  //     </BeautifulNumber>
  //   );
  // }

  return <React.Fragment>{formatNumber(realValue, { dropZ: !fillZero })}</React.Fragment>;
};

export default memo(SymbolPrecision);
