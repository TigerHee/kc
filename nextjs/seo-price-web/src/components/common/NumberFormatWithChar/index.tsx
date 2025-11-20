/**
 * Owner: ella.wang@kupotech.com
 */
import usePriceFormat from '@/hooks/usePriceFormat';
import React from 'react';

type NumberFormatWithCharProps = {
  isUnsaleATemporary?: boolean;
  price: number | string;
  symbol: string;
  hideChar?: boolean;
  needRateConversion?: boolean;
}

// 国际化展示数字
const NumberFormatWithChar = ({ price, symbol, hideChar = false, needRateConversion = true }: NumberFormatWithCharProps) => {
  const showPrice = usePriceFormat({ price, symbol, hideChar, needRateConversion });
  return <React.Fragment>{showPrice}</React.Fragment>;
};

export default NumberFormatWithChar;
