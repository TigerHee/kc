/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
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
  max,
  min,
} from 'utils/operation';
import { Form } from '@kux/mui';
import {
  formatCurrency,
  fx,
  QUANTITY_UNIT,
  useGetSymbolInfo,
  styled,
  useUnit,
  TextIndexTips,
  useMarketInfoForSymbol,
  thousandPointed,
  useGetBestTicker,
} from '@/pages/Futures/import';
import { CROSS, namespace } from '../../config';
import { calcCloseCrossPosPnl } from '@/pages/Futures/calc';
import { FUTURES } from 'src/trade4.0/meta/const';
import { baseCurrencyToQty } from 'src/trade4.0/hooks/futures/useUnit';
import { useGetCurrenciesPrecision } from 'src/trade4.0/hooks/futures/useGetCurrenciesPrecision';
import { usePrettyCurrency } from 'src/trade4.0/components/PrettyCurrency';

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

  // let returnCalcValue = toFixed(minusValue)(8);
  // if (!isInverse) {
  //   returnCalcValue = toFixed(minusValue)(4);
  // }
  // return returnCalcValue;
  return minusValue;
}

const { useWatch } = Form;

const LiquidationTips = (props) => {
  const type = useSelector((state) => state[namespace].liquidationType);
  const position = useSelector((state) => state[namespace].positionItem, isEqual);
  const { currentQty, posCost, settleCurrency, symbol, marginMode } = position;
  const isCross = marginMode === CROSS;
  const TPPrice = useMarketInfoForSymbol(symbol);
  const tradingUnit = useUnit();
  const { prettyCurrency } = usePrettyCurrency();
  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const isQuantity = useUnit() === QUANTITY_UNIT || contract.isInverse;
  const isLong = greaterThan(currentQty)(0);

  // const minCurrency = lessThanOrEqualTo(precision)(0)
  //   ? 1
  //   : toNonExponential(toPow(precision)).toString();
  const { form } = props;
  let price = useWatch('price', form);
  let size = useWatch('size', form);
  const { ask1: _ask1, bid1: _bid1 } = useGetBestTicker();
  const ask1 = _ask1 || 0;
  const bid1 = _bid1 || 0;

  // 市价
  if (type === 'market') {
    if (isLong) {
      price = bid1;
      // 空仓，平仓为买入，看卖一
    } else {
      price = ask1;
    }
  } else if (price) {
    // 多仓，平仓为卖出，看买一
    if (isLong) {
      price = max(bid1, price).toString();
      // 空仓，平仓为买入，看卖一
    } else if (ask1 !== '0') {
      price = min(ask1, price).toString();
    }
  }

  if (!price || !size || size <= 0 || props?.isError) {
    return null;
  }
  const { multiplier, settleCurrency: profitCurrency, isInverse, baseCurrency } = contract;
  size = currentQty < 0 ? -size : size;
  const expectValue = isCross
    ? calcCloseCrossPosPnl({
        position,
        symbolInfo: contract,
        closePrice: price,
        closeQty: baseCurrencyToQty({ baseIncrement: multiplier, amount: size, isQuantity }),
      })
    : calcValue({
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
  const { formatStr } = prettyCurrency({
    value: abs(expectValue),
    currency: settleCurrency,
    isShort: true,
  });
  const langProps = {
    size,
    value: formatStr,
    currency: formatCurrency(profitCurrency),
    baseCurrency:
      !isInverse && tradingUnit !== QUANTITY_UNIT ? formatCurrency(baseCurrency) : undefined,
  };
  // 如果是限价单，需要增加一个参数
  if (type === 'limit') {
    langProps.price = price;
  }

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
