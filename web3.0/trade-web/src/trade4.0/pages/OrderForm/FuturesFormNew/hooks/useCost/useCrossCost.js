/**
 * Owner: garuda@kupotech.com
 */
import { useMemo } from 'react';

import useMakeOrderSizeAndPrice from './useMakeOrderSizeAndPrice';

import { calcMMR, calcIMR, calcCrossOrderMargin } from '../../builtinCommon';
import {
  useGetPositionCalcData,
  useFuturesCrossConfigForSymbol,
  useFuturesTakerFee,
} from '../../builtinHooks';

import { BUY, SELL } from '../../config';
// import { useGetFeeRate } from '../useGetData';

const SIDES = [BUY, SELL];
const useCrossCost = ({ leverage, size, price, type, symbolInfo }) => {
  const { symbol } = symbolInfo;
  const { posOrderQty } = useGetPositionCalcData(symbol);
  // const { takerFeeRate } = useGetFeeRate();
  const { f, m, mmrLimit, mmrLevConstant } = useFuturesCrossConfigForSymbol({ symbol });

  // 计算 MMR
  const MMR = useMemo(() => calcMMR({ maxLev: mmrLevConstant, m, mmrLimit, posOrderQty }), [
    m,
    mmrLevConstant,
    mmrLimit,
    posOrderQty,
  ]);

  // 计算当前的 IMR
  const IMR = useMemo(() => calcIMR({ leverage, f, MMR }), [MMR, f, leverage]);

  const { addSizes, minDealPrices } = useMakeOrderSizeAndPrice({
    size,
    price,
    type,
    symbolInfo,
    noPosSize: true,
  });

  const takerFeeRate = useFuturesTakerFee({ symbol });

  const costs = useMemo(() => {
    return minDealPrices.map((dealPrice, index) => {
      const addSize = addSizes[index];
      const side = SIDES[index];

      const cost = calcCrossOrderMargin({
        symbolInfo,
        price: dealPrice,
        size: addSize,
        IMR,
        takerFeeRate,
        side,
      });
      return { cost, dealPrice };
    });
  }, [IMR, addSizes, minDealPrices, symbolInfo, takerFeeRate]);

  return costs;
};

export default useCrossCost;
