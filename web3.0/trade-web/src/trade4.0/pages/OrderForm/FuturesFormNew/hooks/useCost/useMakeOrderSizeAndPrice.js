/**
 * Owner: garuda@kupotech.com
 */
import { useMemo, useRef } from 'react';

import { isEqual } from 'lodash';

import { CURRENCY_UNIT, abs, dividedBy, plus } from '../../builtinCommon';
import { calculatorDealPrice } from '../../formula';
import { useGetUnit, useGetPositionSize, useGetBBO } from '../useGetData';

const POS_INCREASE = 1;
const NEG_INCREASE = -1;
const DECREASE = 0;

const calcChangeType = (prevSize, addSize, noPosSize) => {
  // 如果不考虑仓位，都为加仓单
  if (noPosSize) return POS_INCREASE;
  // prevSize和addSize符号相同，表示加仓
  if (Number(prevSize) >> 31 === Number(addSize) >> 31) {
    return POS_INCREASE;
  }
  // prevSize和addSize符号相反且addSize的绝对值小于等于prevSize的绝对值表示平仓
  if (Math.abs(addSize) <= Math.abs(prevSize) && Number(prevSize) >> 31 !== Number(addSize) >> 31) {
    return DECREASE;
  }
  // 否则为反向加仓
  return NEG_INCREASE;
};

const useMakeOrderSizeAndPrice = ({ size, price, type, symbolInfo, noPosSize = false }) => {
  const { tradingUnit } = useGetUnit();
  const positionSize = useGetPositionSize();
  const { bid1, ask1 } = useGetBBO();
  const sizeRef = useRef(null);

  const orderSizes = useMemo(() => {
    const _size = size || 0;
    let buyQty = +_size;
    let sellQty = -_size;

    if (tradingUnit === CURRENCY_UNIT) {
      buyQty = abs(dividedBy(buyQty)(symbolInfo?.multiplier)).toNumber();
      sellQty = dividedBy(sellQty)(symbolInfo?.multiplier).toNumber();
    }

    return [buyQty, sellQty];
  }, [symbolInfo, size, tradingUnit]);

  const sizeChangeTypes = useMemo(() => {
    const [buySize, sellSize] = orderSizes;

    return [
      calcChangeType(positionSize, buySize, noPosSize),
      calcChangeType(positionSize, sellSize, noPosSize),
    ];
  }, [noPosSize, orderSizes, positionSize]);

  const addSizes = useMemo(() => {
    return sizeChangeTypes.map((changeType, index) => {
      const orderSize = orderSizes[index];
      switch (changeType) {
        case POS_INCREASE:
          return orderSize;
        case DECREASE:
          return 0;
        case NEG_INCREASE:
          return plus(orderSize)(positionSize).toNumber();
        default:
          return orderSize;
      }
    });
  }, [sizeChangeTypes, orderSizes, positionSize]);

  const minDealPrices = useMemo(() => {
    const dealPrices = calculatorDealPrice({ symbolInfo, type, ask1, price, bid1 });
    if (!isEqual(dealPrices, sizeRef.current)) {
      sizeRef.current = dealPrices;
    }
    return sizeRef.current;
  }, [ask1, bid1, price, symbolInfo, type]);

  return {
    addSizes,
    minDealPrices,
  };
};

export default useMakeOrderSizeAndPrice;
