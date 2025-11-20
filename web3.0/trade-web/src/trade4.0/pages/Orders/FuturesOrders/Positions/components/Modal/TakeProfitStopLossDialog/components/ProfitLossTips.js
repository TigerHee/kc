/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';

import { isEqual } from 'lodash';
import Decimal from 'decimal.js';
import { getDigit } from 'helper';
import { formatCurrency, formatNumber } from '@/utils/futures';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { FUTURES } from '@/meta/const';
import { _t } from 'utils/lang';
import { styled } from '@kux/mui/emotion';
import { getCurrenciesPrecision } from '@/hooks/futures/useGetCurrenciesPrecision';

import { UP_TEXT, DOWN_TEXT, priceTypeToLocaleKey, PROFIT_TYPE, LOSS_TYPE } from '../constants';
import { fx } from 'src/trade4.0/style/emotion';

function calcValue(props) {
  const { isInverse, price, size, posCost, multiplier, places } = props;
  try {
    if (!new Decimal(price).isFinite()) {
      return null;
    }
    return isInverse
      ? new Decimal(-1)
        .div(price)
        .toDP(10)
        .mul(size)
        .toDP(10)
        .minus(posCost)
        .toDP(places)
        .toFixed()
      : new Decimal(size)
        .mul(price)
        .mul(multiplier)
        .minus(posCost)
        .toDP(places)
        .toFixed();
  } catch (e) {
    return null;
  }
}

const TipsDiv = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  ${props => fx.color(props, 'text40')}
`;

const ProfitLossTips = ({ price, stopPriceType, type }) => {
  const { currentQty, posCost, settleCurrency, symbol } = useSelector(
    (state) => state.futures_orders.positionItem,
    isEqual,
  );

  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const { isInverse, multiplier, tickSize, indexPriceTickSize } = contract || {};

  const { shortPrecision } = getCurrenciesPrecision(settleCurrency);

  if (!price) return null;

  const priceFixed = stopPriceType === 'TP' ? tickSize : indexPriceTickSize;
  const formatPrice = formatNumber(price, {
    fixed: getDigit(priceFixed),
    dropZ: false,
    pointed: false,
  });

  let sideText = currentQty < 0 ? _t(UP_TEXT) : _t(DOWN_TEXT);
  if (type === PROFIT_TYPE) {
    sideText = currentQty < 0 ? _t(DOWN_TEXT) : _t(UP_TEXT);
  }

  let profitPrice = calcValue({
    isInverse,
    price,
    size: currentQty,
    posCost,
    multiplier,
    places: Number(shortPrecision),
  });

  let showType = type;

  // FIXME: 暂时改成 如果计算值 < 0 则显示亏损文案，反之亦然
  if (profitPrice < 0) {
    showType = LOSS_TYPE;
    profitPrice = -profitPrice;
  } else if (profitPrice > 0) {
    showType = PROFIT_TYPE;
  }

  // TODO 翻译需要改造
  return (
    <TipsDiv>
      {_t(`stopClose.${showType}.tip`, {
        side: sideText,
        price: formatPrice,
        profit: profitPrice,
        type: _t(priceTypeToLocaleKey[stopPriceType]),
      })}
      {` ${formatCurrency(settleCurrency)}`}
    </TipsDiv>
  );
};

export default ProfitLossTips;
