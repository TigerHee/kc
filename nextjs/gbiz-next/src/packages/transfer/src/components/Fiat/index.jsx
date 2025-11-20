/**
 * Owner: solar@kupotech.com
 */
import { useMemo, useEffect } from 'react';
import isNil from 'lodash-es/isNil';
import NumberFormat from '../NumberFormat';
import { useTransferDispatch, useTransferSelector } from '../../utils/redux';

import { safeBigNumber } from '../../utils/number';
import { useProps } from '../../hooks/props';
import { currencyMap } from './base';

function usePrices() {
  const dispatchTransfer = useTransferDispatch();
  const prices = useTransferSelector((state) => state.prices);
  const fiatCurrency = useProps((props) => props.extInfo.baseLegalCurrency);

  useEffect(() => {
    dispatchTransfer({
      type: 'getPrices',
      payload: {
        base: fiatCurrency,
      },
    });
  }, [fiatCurrency]);
  return { prices, fiatCurrency };
}

export default function Fiat({ currency, amount, useLegalChars = true, className }) {
  const { prices, fiatCurrency } = usePrices();
  const _amount = useMemo(() => {
    const rate = prices[currency];
    if (!rate) return null;
    return safeBigNumber(
      (B) =>
        B(amount)
          .multipliedBy(rate)
          .decimalPlaces(2, B.ROUND_DOWN)
          .toString(),
      null,
    );
  }, [amount, prices, currency]);
  const content = useMemo(() => {
    if (isNil(amount)) return null;
    if (amount > 0 && +_amount === 0) {
      return (
        <>
          <span>&lt; </span>
          <NumberFormat isPositive={false} currency={currencyMap[fiatCurrency] || ''}>
            {0.01}
          </NumberFormat>
        </>
      );
    }
    return (
      <>
        <span>≈ </span>
        <NumberFormat isPositive={false} currency={currencyMap[fiatCurrency] || ''}>
          {_amount}
        </NumberFormat>
      </>
    );
  }, [_amount, fiatCurrency, amount]);

  return <div className={className}>{content}</div>;
}
