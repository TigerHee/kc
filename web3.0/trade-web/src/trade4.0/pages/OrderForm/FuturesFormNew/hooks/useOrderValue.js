/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import {
  useGetActiveTab,
  useGetBBO,
  useGetSymbolInfo,
  useGetUnit,
  getActiveTab,
  getBBO,
  getSymbolInfo,
  getUnit,
} from './useGetData';

import { abs, dividedBy, multiply, min, QUANTITY_UNIT } from '../builtinCommon';
import { baseCurrencyToQty } from '../builtinHooks';

import { CALC_LIMIT, CALC_MARKET } from '../config';

// 订单价值 a*price*size / 1/price * size * a
export const makeOrderValue = ({ size, price, symbolInfo }) => {
  const { multiplier, isInverse } = symbolInfo;
  if (!size || !multiplier) return 0;
  const baseSize = multiply(size)(multiplier);

  return abs(multiply(isInverse ? dividedBy(1)(price) : price)(baseSize)).toNumber();
};

export const useOrderValue = ({ price, size }) => {
  const { tradingUnit } = useGetUnit();
  const { orderType } = useGetActiveTab();
  const { bid1 } = useGetBBO();
  const { symbolInfo = {} } = useGetSymbolInfo();

  const _size = baseCurrencyToQty({
    baseIncrement: symbolInfo.multiplier,
    amount: size,
    isQuantity: symbolInfo.isInverse || tradingUnit === QUANTITY_UNIT,
  });

  const dealPrice = React.useMemo(() => {
    if (CALC_LIMIT.includes(orderType)) {
      return min(symbolInfo?.maxPrice, price).toNumber();
    } else if (CALC_MARKET.includes(orderType)) {
      return bid1;
    }
    return 0;
  }, [orderType, symbolInfo, price, bid1]);

  const orderValue = React.useMemo(() => {
    return makeOrderValue({ symbolInfo, price: dealPrice, size: _size });
  }, [symbolInfo, dealPrice, _size]);

  return orderValue;
};

export const getOrderValue = ({ price, size, postSize }) => {
  const { tradingUnit } = getUnit();
  const { orderType } = getActiveTab();
  const { bid1 } = getBBO();
  const { symbolInfo } = getSymbolInfo();

  const _size =
    postSize ||
    baseCurrencyToQty({
      baseIncrement: symbolInfo.multiplier,
      amount: size,
      isQuantity: symbolInfo.isInverse || tradingUnit === QUANTITY_UNIT,
    });

  let dealPrice = 0;
  if (CALC_LIMIT.includes(orderType)) {
    dealPrice = min(symbolInfo?.maxPrice, price).toNumber();
  } else if (CALC_MARKET.includes(orderType)) {
    dealPrice = bid1;
  }

  return makeOrderValue({ symbolInfo, price: dealPrice, size: _size });
};
