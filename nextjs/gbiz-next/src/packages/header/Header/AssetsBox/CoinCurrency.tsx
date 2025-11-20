/**
 * Owner: iron@kupotech.com
 */
import React, { FC } from 'react';
import { multiply } from 'tools/math';
import { formatLangNumber } from '../../common/tools';
import { useHeaderStore } from '../model';

interface CoinCurrencyProps {
  currency?: string;
  coin: string;
  value: number;
  showType?: number;
  defaultValue?: string;
  className?: string;
  amountClassName?: string;
  currencyClassName?: string;
  hideLegalCurrency?: boolean;
  lang?: string;
  needShowEquelFlag?: boolean;
}

const CoinCurrency: FC<CoinCurrencyProps> = props => {
  const {
    currency,
    coin,
    value,
    showType = 1,
    defaultValue,
    className,
    amountClassName,
    currencyClassName,
    hideLegalCurrency,
    lang = 'en_US',
    needShowEquelFlag = true,
  } = props;

  const prices = useHeaderStore(state => state.prices) || {};
  const rate = prices[coin];
  if (!rate || value === null) {
    return <span>{defaultValue}</span>;
  }

  let target = formatLangNumber(multiply(rate, value), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (+value === 0 || +target !== 0) {
    target = showType === 1 ? `${needShowEquelFlag ? '≈' : ''} ${target}` : target;
  } else {
    target = '< 0.01';
  }
  return (
    <span className={className}>
      <span className={amountClassName}>{target}</span>
      {!hideLegalCurrency && (
        <span style={{ marginLeft: 4 }} className={currencyClassName}>
          {currency}
        </span>
      )}
    </span>
  );
};

export default CoinCurrency;
