/**
 * Owner: willen@kupotech.com
 */
import { CURRENCY_CHARS } from 'config/base';
import { formatNumber, multiplyFloor } from 'helper';
import React from 'react';
import { connect } from 'react-redux';

/**
 * @param currency 法币
 * @param prices 所有币种对应的法币价格
 * @param coin 币种
 * @param value 币种数量
 */

@connect((state) => {
  const { currency, prices } = state.currency;
  return {
    currency,
    prices,
  };
})
export default class CoinCurrency extends React.Component {
  static defaultProps = {
    defaultValue: null,
    value: null,
  };

  render() {
    const {
      currency,
      prices,
      coin,
      value,
      showType = 1,
      defaultValue,
      className,
      amountClassName,
      currencyClassName,
      hideLegalCurrency,
      needShowEquelFlag = true,
      useLegalChars = false,
      showUsdtPrice = false,
    } = this.props;
    const rate = prices[coin];
    if (!rate || value === null) {
      return <span>{defaultValue}</span>;
    }
    const selected = CURRENCY_CHARS.find((item) => item.currency === currency);
    const legalChars = useLegalChars ? (selected ? `${selected.char} ` : '') : '';
    let target = formatNumber(multiplyFloor(showUsdtPrice ? 1 : rate, value, 2), 2);
    if (+value === 0 || +target !== 0) {
      target = `${legalChars}${target}`;
      target = showType === 1 ? `${needShowEquelFlag ? '≈ ' : ''}${target}` : target;
    } else {
      target = `< ${legalChars}0.01`;
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
  }
}
