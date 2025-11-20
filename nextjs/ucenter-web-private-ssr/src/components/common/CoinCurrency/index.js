/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from 'components/LoadLocale';
import { numberFormat, styled } from '@kux/mui';
import { CURRENCY_CHARS } from 'config/base';
import { multiplyFloor } from 'helper';
import React from 'react';
import { connect } from 'react-redux';

const Price = styled.span`
  font-size: 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 15px;
  }
`;

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
@injectLocale
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
      defaultValue,
      css,
      amountClassName,
      currencyClassName,
      hideLegalCurrency,
      needShowEquelFlag = true,
      useLegalChars = false,
      isRTL,
      currentLang,
    } = this.props;
    const rate = prices[coin];
    if (!rate || value === null) {
      return <span>{defaultValue}</span>;
    }
    const selected = CURRENCY_CHARS.find((item) => item.currency === currency);
    const legalChars = useLegalChars ? (selected ? `${selected.char}` : '') : '';
    let target = multiplyFloor(rate, value, 2);
    if (+value === 0 || +target !== 0) {
      target = `${legalChars}${numberFormat({ number: target, lang: currentLang })}`;
      target = `${needShowEquelFlag ? '≈ ' : ''}${target}`;
    } else {
      target = `< ${legalChars}${numberFormat({ number: 0.01, lang: currentLang })}`;
    }

    return isRTL ? (
      <span css={css}>
        <Price className={amountClassName}>
          {target} {!hideLegalCurrency ? currency : null}
        </Price>
      </span>
    ) : (
      <span css={css}>
        <Price className={amountClassName}>{target}</Price>
        {!hideLegalCurrency && (
          <span style={{ marginLeft: 4 }} className={currencyClassName}>
            {currency}
          </span>
        )}
      </span>
    );
  }
}
