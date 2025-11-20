/**
 * Owner: willen@kupotech.com
 */
import classNames from 'classnames';
import CoinCodeToName from 'components/common/CoinCodeToName';
import CoinCurrency from 'components/common/CoinCurrency';
import CoinPrecision from 'components/common/CoinPrecision';
import { blockCss } from './styled';

export default function CurrencyBox({
  currency,
  value,
  showLegal,
  block,
  css,
  legalClassName,
  currencyValueClassName,
  containerClass,
}) {
  const amountCls = classNames('color-gray', {
    [legalClassName]: !!legalClassName,
    amount: !block,
  });
  const currencyCls = classNames('color-gray', {
    [legalClassName]: !!legalClassName,
  });
  return (
    <CurrencyBox className={containerClass}>
      <span css={css}>
        <span css={currencyValueClassName}>
          <CoinPrecision coin={currency} value={value} />
        </span>{' '}
        <CoinCodeToName coin={currency} />
      </span>
      {!!showLegal && (
        <CoinCurrency
          css={blockCss(block)}
          value={value}
          coin={currency}
          amountClassName={amountCls}
          currencyClassName={currencyCls}
        />
      )}
    </CurrencyBox>
  );
}
