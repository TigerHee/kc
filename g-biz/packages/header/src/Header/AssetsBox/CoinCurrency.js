/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { multiply } from '@utils/math';
import { formatLangNumber } from '../../common/tools';
import { namespace } from '../model';

export default (props) => {
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

  const { prices } = useSelector((state) => state[namespace]);
  const rate = prices[coin];
  if (!rate || value === null) {
    return <span>{defaultValue}</span>;
  }

  let target = formatLangNumber(multiply(rate, value), lang, {
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
