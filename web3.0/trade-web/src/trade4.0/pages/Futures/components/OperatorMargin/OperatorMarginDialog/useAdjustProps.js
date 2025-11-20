/**
 * Owner: garuda@kupotech.com
 * 获取计算值
 */
import { useMemo } from 'react';

import { getAppendMarginDetail } from '@/hooks/futures/useGetFuturesPositionsInfo';

import {
  makeAfterEntryPrice,
  makeAfterMargin,
  makeAfterLiquidationPrice,
  makeAfterLeverage,
} from '../utils';

const useAdjustProps = ({ inputMargin, type, isError, calcData, markPrice }) => {
  // 获取当前仓位的数据
  const { margin, liquidationPrice, avgEntryPrice, leverage: pLeverage } = getAppendMarginDetail();

  // 当前的总保证金
  const totalMargin = calcData?.totalMargin || margin;
  // 当前的真实杠杆
  const currentLeverage = calcData?.realLeverage || pLeverage;

  // 计算后的总保证金
  const afterMargin = useMemo(() => {
    return makeAfterMargin({ inputMargin, isError, totalMargin, type });
  }, [inputMargin, isError, totalMargin, type]);

  // 计算后的强平价格
  const afterLiquidationPrice = useMemo(() => {
    return makeAfterLiquidationPrice({ inputMargin, isError, type });
  }, [inputMargin, isError, type]);

  // 计算后的开仓价格
  const afterEntryPrice = useMemo(() => {
    return makeAfterEntryPrice({ inputMargin, isError, markPrice, type });
  }, [inputMargin, isError, markPrice, type]);

  // 计算后的真实杠杆
  const afterRealLeverage = useMemo(() => {
    return makeAfterLeverage({ afterMargin, isError, markPrice });
  }, [afterMargin, isError, markPrice]);

  return {
    avgEntryPrice,
    afterEntryPrice,
    liquidationPrice,
    afterLiquidationPrice,
    totalMargin,
    afterMargin,
    leverage: currentLeverage,
    afterRealLeverage,
  };
};

// 返回低频更新对象
export const getAdjustProps = ({ inputMargin, type, isError, calcData, markPrice }) => {
  // 获取当前仓位的数据
  const { margin, liquidationPrice, avgEntryPrice, leverage: pLeverage } = getAppendMarginDetail();

  // 当前的总保证金
  const totalMargin = calcData?.totalMargin || margin;
  // 当前的真实杠杆
  const currentLeverage = calcData?.realLeverage || pLeverage;

  // 计算后的总保证金
  const afterMargin = makeAfterMargin({ inputMargin, isError, totalMargin, type });

  // 计算后的强平价格
  const afterLiquidationPrice = makeAfterLiquidationPrice({ inputMargin, isError, type });

  // 计算后的开仓价格
  const afterEntryPrice = makeAfterEntryPrice({ inputMargin, isError, markPrice, type });

  // 计算后的真实杠杆
  const afterRealLeverage = makeAfterLeverage({ afterMargin, isError, markPrice });

  return {
    avgEntryPrice,
    afterEntryPrice,
    liquidationPrice,
    afterLiquidationPrice,
    totalMargin,
    afterMargin,
    leverage: currentLeverage,
    afterRealLeverage,
  };
};

export default useAdjustProps;
