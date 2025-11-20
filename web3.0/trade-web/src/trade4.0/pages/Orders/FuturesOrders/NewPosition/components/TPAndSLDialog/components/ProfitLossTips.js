/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import {
  fx,
  styled,
  getCurrenciesPrecision,
  useI18n,
  getDigit,
  Decimal,
  formatCurrency,
  formatNumber,
  useGetSymbolInfo,
  priceTypeToLocaleKey,
  thousandPointed,
} from '@/pages/Futures/import';
import { calcCrossStopPNL } from '@/pages/Futures/calc';
import { UP_TEXT, DOWN_TEXT, PROFIT_TYPE, LOSS_TYPE } from '../constants';
import { CROSS, namespace } from '../../../config';
import { FUTURES } from 'src/trade4.0/meta/const';
import { makeNumber } from 'src/trade4.0/utils/futures/makeNumber';
import { usePrettyCurrency } from 'src/trade4.0/components/PrettyCurrency';

function calcValue(props) {
  const { isInverse, price, size, posCost, multiplier, places } = props;
  try {
    if (!new Decimal(price).isFinite()) {
      return null;
    }
    // eslint-disable-next-line newline-per-chained-call
    const coinValue = new Decimal(-1).div(price).toDP(10).mul(size).toDP(10).minus(posCost);
    const baseValue = new Decimal(size).mul(price).mul(multiplier).minus(posCost);
    return isInverse ? coinValue : baseValue;
  } catch (e) {
    return null;
  }
}

const TipsDiv = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  ${(props) => fx.color(props, 'text40')}
`;

const ProfitLossTips = ({ price, stopPriceType, type }) => {
  const { _t } = useI18n();
  const { prettyCurrency } = usePrettyCurrency();
  const position = useSelector((state) => state[namespace].positionItem, isEqual);
  const { currentQty, posCost, settleCurrency, symbol, marginMode } = position;
  const isCross = marginMode === CROSS;

  const symbolInfo = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const { isInverse, multiplier, tickSize, indexPriceTickSize } = symbolInfo || {};

  const { shortPrecision } = getCurrenciesPrecision(settleCurrency);

  if (!price) return null;

  const priceFixed = stopPriceType === 'TP' ? tickSize : indexPriceTickSize;
  const formatPrice = formatNumber(price, {
    fixed: getDigit(priceFixed),
    dropZ: false,
    pointed: true,
  });

  let sideText = currentQty < 0 ? _t(UP_TEXT) : _t(DOWN_TEXT);
  if (type === PROFIT_TYPE) {
    sideText = currentQty < 0 ? _t(DOWN_TEXT) : _t(UP_TEXT);
  }

  let profitPrice = isCross
    ? calcCrossStopPNL({ position, symbolInfo, stopQty: currentQty, stopPrice: price })
    : calcValue({
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

  const { formatStr } = prettyCurrency({
    value: profitPrice,
    currency: settleCurrency,
    isShort: true,
  });

  // TODO 翻译需要改造
  return (
    <TipsDiv>
      {_t(`stopClose.${showType}.tip`, {
        side: sideText,
        price: formatPrice,
        profit: formatStr,
        type: _t(priceTypeToLocaleKey[stopPriceType]),
      })}
      {` ${formatCurrency(settleCurrency)}`}
    </TipsDiv>
  );
};

export default ProfitLossTips;
