/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import useMakeOrderSizeAndPrice from './useMakeOrderSizeAndPrice';

import { abs, dividedBy, multiply, plus } from '../../builtinCommon';
import { useFuturesTakerFee } from '../../builtinHooks';
import { useGetFeeRate } from '../useGetData';
import { makeOrderValue } from '../useOrderValue';

/**
 * operator isInverse ? div : mul
 * fixTakerFee 固定手续费 -- 接口获取
 * takerFeeRate 开仓手续费 -- 接口获取
 * margin * (1/leverage + 1) 破产价值
 * 成本计算公式: openMargin + openFee + closeFee
 * 委托价值 abs size * multiplier operator price
 * margin: 委托价值 * leverage
 * openFee: 委托价值 * takerFeeRate + size * fixTakerFee
 * closeFee: 委托价值 * (1/leverage + 1) * takerFeeRate  + size * fixTakerFee
 */

const calcOpenMargin = ({ size = 0, price, leverage, symbolInfo }) => {
  if (!leverage || !price) return 0;
  const orderValue = makeOrderValue({ price, size, symbolInfo });
  return dividedBy(orderValue)(leverage).toNumber();
};

const returnOrderFee = ({
  size = 0,
  price = 0,
  takerFeeRate = 0,
  leverage,
  fixTakerFee = 0,
  symbolInfo,
}) => {
  const orderValue = makeOrderValue({ price, size, symbolInfo });
  const takerValue = multiply(orderValue)(takerFeeRate);
  const sizeTaker = abs(multiply(size)(fixTakerFee));
  const openFee = plus(takerValue)(sizeTaker).toString();
  const closeFee = plus(multiply(takerValue)(plus(dividedBy(1)(leverage))(1)))(
    sizeTaker,
  ).toString();

  return { openFee, closeFee };
};

const useIsolatedCost = ({ leverage, size, price, type, symbolInfo }) => {
  const { fixTakerFee } = useGetFeeRate();

  const { addSizes, minDealPrices } = useMakeOrderSizeAndPrice({
    size,
    price,
    type,
    symbolInfo,
  });

  const takerFeeRate = useFuturesTakerFee({ symbol: symbolInfo?.symbol });

  const costMap = React.useMemo(() => {
    return minDealPrices.map((dealPrice, index) => {
      const addSize = addSizes[index];
      const openMargin = calcOpenMargin({ price: dealPrice, size: addSize, leverage, symbolInfo });
      const { openFee, closeFee } = returnOrderFee({
        size: addSize,
        price: dealPrice,
        takerFeeRate,
        fixTakerFee,
        symbolInfo,
        leverage,
      });
      const result = plus(openMargin)(plus(openFee)(closeFee));
      const cost = result.isFinite() ? result.toNumber() : 0;
      return { cost, closeFee, dealPrice };
    });
  }, [addSizes, fixTakerFee, leverage, minDealPrices, symbolInfo, takerFeeRate]);

  return costMap;
};

export default useIsolatedCost;
