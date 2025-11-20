/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import { setNumToPrecision, multiplyFloor, dropZero, numberFixed } from 'helper';
import { currencyMap } from 'config/base';
import NumberFormat from '../NumberFormat';

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

  // 处理amount
  wrapperAmount(amount) {
    const {
      currency,
      hideLegalCurrency,
      useLegalChars = false,
      value,
      showType = 1,
      needShowEquelFlag = true,
      isPositive = false,
    } = this.props;
    const legalChars = currencyMap[currency] || '';
    const showLegalChars = !hideLegalCurrency && useLegalChars && legalChars;

    if (+value === 0 || +amount !== 0) {
      const temp = showLegalChars ? (
        <span>
          <span>{legalChars}</span>
          <span>
            <NumberFormat isPositive={isPositive}>{amount}</NumberFormat>
          </span>
        </span>
      ) : (
        <span>
          <NumberFormat isPositive={isPositive}>{amount}</NumberFormat>
        </span>
      );
      return showType === 1 ? (
        <span>
          <span>{needShowEquelFlag ? ' ≈ ' : ''}</span>
          <span>{temp}</span>
        </span>
      ) : (
        <span>{temp}</span>
      );
    } else {
      return <span>{`< ${showLegalChars ? `${legalChars}` : ''}0.01`}</span>;
    }
  }

  render() {
    const {
      currency,
      prices,
      coin,
      value,
      defaultValue,
      className,
      amountClassName,
      currencyClassName,
      hideLegalCurrency,
      useLegalChars = false,
      padZero, // 补0的位数
    } = this.props;
    const rate = prices[coin];
    if (!rate || value === null) {
      return <span className={className}>{defaultValue}</span>;
    }
    // 格式化法币显示
    const targetValue = multiplyFloor(rate, value, 2);

    const target = this.wrapperAmount(
      padZero ? setNumToPrecision(targetValue, 2) : dropZero(numberFixed(targetValue, 2)),
    );

    return (
      <span className={className}>
        <span className={amountClassName}>{target}</span>
        {!hideLegalCurrency && !useLegalChars && (
          <span className={currencyClassName}>{` ${currency}`}</span>
        )}
      </span>
    );
  }
}
