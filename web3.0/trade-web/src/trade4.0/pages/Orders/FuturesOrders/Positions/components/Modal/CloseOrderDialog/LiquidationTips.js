/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual, find } from 'lodash';
import {
  multiply,
  toNonExponential,
  dividedBy,
  minus,
  toFixed,
  greaterThan,
  abs,
  greaterThanOrEqualTo,
  lessThanOrEqualTo,
  toPow,
} from 'utils/operation';
import { QUANTITY_UNIT } from '@/pages/Orders/FuturesOrders/config';
import { formatCurrency } from '@/utils/futures';
import { FUTURES } from '@/meta/const';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { useUnit } from '@/hooks/futures/useUnit';
import { styled } from '@kux/mui/emotion';
import { Form } from '@kux/mui';

import TextIndexTips from '@/pages/Orders/FuturesOrders/components/TextIndexTips';
import { fx } from 'src/trade4.0/style/emotion';
import { useGetCurrenciesPrecision } from 'src/trade4.0/hooks/futures/useGetCurrenciesPrecision';
import { thousandPointed } from 'src/trade4.0/utils/format';

const TipsContent = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  ${(props) => fx.color(props, 'text40')}
`;

function calcValue({ price, cSize, posCost, qty, multiplier, isInverse, tradingUnit }) {
  let size = cSize;
  // 如果是正向合约，单位不为张，换算成张数
  if (!isInverse && tradingUnit !== QUANTITY_UNIT) {
    size = dividedBy(cSize)(multiplier);
  }
  let currentValue = toFixed(multiply(toFixed(dividedBy(multiplier)(price))(10))(size))(10);
  // 正向合约的公式跟反向的不同
  if (!isInverse) {
    currentValue = toFixed(multiply(multiply(multiplier)(price))(size))(10);
  }

  const postValue = toFixed(dividedBy(multiply(posCost)(size))(qty))(10);

  const minusValue = minus(currentValue)(postValue);

  let returnCalcValue = toFixed(minusValue)(8);
  if (!isInverse) {
    returnCalcValue = toFixed(minusValue)(4);
  }
  return returnCalcValue;
}

const { useWatch } = Form;

const LiquidationTips = (props) => {
  const marketList = useSelector((state) => state.futuresMarket.sortedMarkets, isEqual);
  const type = useSelector((state) => state.futures_orders.liquidationType);
  const { currentQty, posCost, settleCurrency, symbol } = useSelector(
    (state) => state.futures_orders.positionItem,
    isEqual,
  );
  const tradingUnit = useUnit();
  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const { shortPrecision: precision } = useGetCurrenciesPrecision(settleCurrency);
  const minCurrency = lessThanOrEqualTo(precision)(0)
    ? 1
    : toNonExponential(toPow(precision)).toString();
  const { form } = props;
  let price = useWatch('price', form);
  let size = useWatch('size', form);

  if (type === 'market') {
    const marketInfo = find(marketList, (o) => o.symbol === symbol);
    price = marketInfo && marketInfo.lastPrice;
  }

  if (!price || !size || size <= 0 || props?.isError) {
    return null;
  }
  const { multiplier, settleCurrency: profitCurrency, isInverse, baseCurrency } = contract;
  size = currentQty < 0 ? -size : size;
  const expectValue = calcValue({
    isInverse,
    price,
    cSize: size,
    posCost,
    qty: currentQty,
    settleCurrency,
    multiplier,
    tradingUnit,
  });
  const isProfit = greaterThan(expectValue)(0);
  const langProps = {
    size,
    value: greaterThanOrEqualTo(minCurrency)(expectValue)
      ? `<=${minCurrency}`
      : thousandPointed(toNonExponential(abs(toFixed(expectValue)(precision)))),
    currency: formatCurrency(profitCurrency),
    baseCurrency:
      !isInverse && tradingUnit !== QUANTITY_UNIT ? formatCurrency(baseCurrency) : undefined,
  };
  // 如果是限价单，需要增加一个参数
  if (type === 'limit') {
    langProps.price = price;
  }
  // format props
  langProps.size = langProps.size ? thousandPointed(langProps.size) : langProps.size;
  langProps.price = langProps.price ? thousandPointed(langProps.price) : langProps.price;

  const langKey = () => {
    const baseText = isProfit ? `partial.order.${type}.profit` : `partial.order.${type}.loss`;
    if (contract.isInverse) {
      return baseText;
    }
    return tradingUnit === QUANTITY_UNIT ? baseText : `${baseText}.baseCurrency`;
  };

  return (
    <TipsContent>
      <TextIndexTips langKey={langKey()} contract={contract} langProps={langProps} />
    </TipsContent>
  );
};

export default React.memo(LiquidationTips);
