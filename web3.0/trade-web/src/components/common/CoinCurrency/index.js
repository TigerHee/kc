/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { connect } from 'dva';
import { isNaN } from 'lodash';
import { formatNumber, multiplyAndFixed } from 'helper';

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
    const { currency, prices, coin, value, showType = 1,
      defaultValue, className, amountClassName, currencyClassName } = this.props;
    const rate = prices[coin];
    if (!rate || value === null || isNaN(+value)) {
      return (
        <span>
          {defaultValue}
        </span>
      );
    }

    // fix: 法币价格小数位 大于1显示2位 小于1显示6位
    const currencyPrice = +multiplyAndFixed(rate, value);
    const currencyDecimal = currencyPrice > 1 ? 2 : 6;
    let target = formatNumber(currencyPrice, currencyDecimal);
    if (+value === 0 || +target !== 0) {
      target = showType === 1 ? `≈ ${target}` : target;
    } else { // 法币目前不存在负数，暂时没有处理负数的情况
      target = `< ${currencyDecimal === 2 ? '0.01' : '0.000001'}`;
    }

    return (
      <span className={className}>
        <span className={amountClassName}>
          {target}
        </span>
        {
          showType === 3 ? null : (<span className={currencyClassName}>&nbsp;{currency}</span>)
        }
      </span>
    );
  }
}
