/**
 * Owner: odan.ou@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { currencyMap } from 'utils/constants';
import { NumberFormat } from '@kux/mui';
import { multiplyFloor } from 'helper';

// 解决rtl情况下货币符号被翻转的问题
const NumberWithChar = ({ price, symbol, hideChar, needHandlePrice, needTransfer = true }) => {
  const currentLang = useSelector((state) => state.app.currentLang);
  const currency = useSelector((state) => state.currency.currency);
  const currencyRate = useSelector((state) => state.currency.rates[currency]);
  const prices = useSelector((state) => state.currency.prices);
  const symbolsInfoMap = useSelector((state) => state.symbols.symbolsMap);
  const finalPrice = () => {
    if (!price) return price;
    const char = currencyMap[currency] || currency;
    const baseCoin = symbol?.split('-')[1];
    const baseCoinRate = prices ? prices[baseCoin] : null;
    if (baseCoinRate) {
      const _char = hideChar ? '' : char;
      const precision = symbolsInfoMap[symbol]?.precision || 2;
      const target = needTransfer
        ? multiplyFloor(baseCoinRate, price, precision)
        : multiplyFloor(currencyRate, price, precision);
      // 整数位大于1，小数点后取2位，末位去0。否则按照默认精度
      const _precision = needHandlePrice ? (Math.abs(target) > 1 ? 2 : precision) : precision;
      return (
        <NumberFormat
          currency={_char}
          lang={currentLang}
          options={{ maximumFractionDigits: _precision }}
        >
          {target}
        </NumberFormat>
      );
    } else {
      return <NumberFormat lang={currentLang}>{price}</NumberFormat>;
    }
  };

  return finalPrice();
};

export default NumberWithChar;
