/**
 * Owner: charles.yang@kupotech.com
 */
import { useMemo } from 'react';

import Decimal from 'decimal.js';

import { useGetSymbolInfo, useGetUnit } from './useGetData';

import { dividedBy, multiply, QUANTITY_UNIT, CURRENCY_UNIT, toNearest } from '../builtinCommon';

import { USDS_MIN_VALUE } from '../config';

export const getConvertValue = ({ size, price, multiplier, tradingUnit, chooseUSDsUnit }) => {
  if (!size || !price) {
    return 0;
  }
  let handleSize = size;
  if (chooseUSDsUnit && price && size) {
    // 张数 * 价格 = 显示出的usdt数量
    if (tradingUnit === CURRENCY_UNIT) {
      handleSize = toNearest(multiply(size)(price))(USDS_MIN_VALUE, Decimal.ROUND_UP).toNumber();
    } else if (tradingUnit === QUANTITY_UNIT) {
      // 按usds下单的时候， 如果 tradingUnit 是 x 张。
      // 张数 * 合约乘数 * 价格 = 显示出的usdt数量
      handleSize = toNearest(multiply(multiply(size)(price))(multiplier))(
        USDS_MIN_VALUE,
        Decimal.ROUND_UP,
      ).toNumber();
    }
  }
  return handleSize;
};

/**
 * @method getConvertSize
 * @description 按照usds下单的时候，下单填入的xxx usds 转化为 x 张 或者 x 币数。
 * @param {number} param.size 填入的xxx usds
 * @param {number} param.price 下单的价格
 * @param {number} param.multiplier 合约乘数
 * @param {boolean} param.tradingUnit 单位
 * @param {boolean} param.chooseUSDsUnit 是否是按usds下单
 * @returns
 */
export const getConvertSize = ({
  size,
  price,
  multiplier,
  tradingUnit,
  chooseUSDsUnit,
  isInverse,
}) => {
  if (!size || !price || !multiplier) {
    return 0;
  }
  if (isInverse) {
    return size;
  }

  let handleSize = size;
  if (chooseUSDsUnit && price && size) {
    // 按usds下单的时候， 如果 tradingUnit 是 x 币数。
    // 预计币对数量 = floor（输入的usdt / 委托价格，ticksize），表示向下取小
    if (tradingUnit === CURRENCY_UNIT) {
      handleSize = toNearest(dividedBy(size)(price))(multiplier, Decimal.ROUND_DOWN).toNumber();
    } else if (tradingUnit === QUANTITY_UNIT) {
      // 按usds下单的时候， 如果 tradingUnit 是 x 张。
      // 预计币对张数 = floor（输入的usdt / 委托价格，整数）* 合约乘数，表示向下取小
      handleSize = dividedBy(dividedBy(size)(price))(multiplier)
        .floor()
        .toNumber();
    }
  }
  return handleSize;
};

/**
 * @method getConvertUnit
 * @description 按照usds下单的时候，获取到单位是 x 张 或者 x 币数 或者 x usdt。
 * @param {number} param.unit 默认显示单位
 * @param {boolean} param.tradingUnit 单位
 * @param {boolean} param.chooseUSDsUnit 是否是按usds下单
 * @returns
 */
export const getConvertUnit = ({ unit, chooseUSDsUnit, quoteCurrency, isInverse }) => {
  return chooseUSDsUnit && !isInverse ? quoteCurrency : unit;
};

/**
 * @method useGetUSDsUnit
 * @description 按照usds下单的时候，获取到单位是 x 张 或者 x 币数 或者 x usdt。
 * @param {number} size 默认显示单位
 * @param {number} price 下单的价格
 * @returns
 */
const useGetUSDsUnit = (size = 0, price = 0) => {
  const { unit, tradingUnit, chooseUSDsUnit } = useGetUnit();
  const { symbolInfo: contract } = useGetSymbolInfo();

  const _size = useMemo(() => {
    return getConvertSize({
      size,
      price,
      multiplier: contract.multiplier,
      chooseUSDsUnit,
      tradingUnit,
      isInverse: contract.isInverse,
    });
  }, [size, price, contract.multiplier, contract.isInverse, chooseUSDsUnit, tradingUnit]);

  const _unit = useMemo(() => {
    return getConvertUnit({
      unit,
      chooseUSDsUnit,
      quoteCurrency: contract.quoteCurrency,
      isInverse: contract.isInverse,
    });
  }, [unit, chooseUSDsUnit, contract.quoteCurrency, contract.isInverse]);

  return { size: _size, unit: _unit, chooseUSDsUnit, tradingUnit };
};

export default useGetUSDsUnit;
