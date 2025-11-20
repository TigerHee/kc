/**
 * Owner: garuda@kupotech.com
 * 获取计算值
 */
import { useMemo } from 'react';

import { getCurrenciesPrecision } from '@/hooks/futures/useGetCurrenciesPrecision';
import { getAppendMarginDetail } from '@/hooks/futures/useGetFuturesPositionsInfo';

import { formatNumber } from '@/utils/futures';

import {
  makeAfterEntryPrice,
  makeInputMarginToType,
  makeLeverageToExpectMargin,
  makeAfterMargin,
  makeAfterLiquidationPrice,
} from '../utils';

const useAdjustProps = ({ leverage, isError, calcData, markPrice, disabled }) => {
  // 获取当前仓位的数据
  const {
    margin,
    liquidationPrice,
    avgEntryPrice,
    leverage: pLeverage,
    settleCurrency,
  } = getAppendMarginDetail();

  // 当前的总保证金
  const totalMargin = calcData?.totalMargin || margin;
  // 当前的真实杠杆
  const currentLeverage = calcData?.realLeverage || pLeverage;

  // 反推杠杆变动保证金
  const inputMargin = useMemo(() => {
    if (disabled) return '';

    const { shortPrecision: shortP } = getCurrenciesPrecision(settleCurrency);

    const expectMargin = formatNumber(
      makeLeverageToExpectMargin({ leverage, currentLeverage, totalMargin, markPrice }),
      { fixed: shortP, pointed: false },
    );
    return expectMargin;
  }, [currentLeverage, disabled, leverage, markPrice, settleCurrency, totalMargin]);

  const type = useMemo(() => {
    return disabled ? '' : makeInputMarginToType({ inputMargin });
  }, [disabled, inputMargin]);

  // 计算后的总保证金
  const afterMargin = useMemo(() => {
    return disabled ? '' : makeAfterMargin({ inputMargin, isError, totalMargin, type });
  }, [disabled, inputMargin, isError, totalMargin, type]);

  // 计算后的强平价格
  const afterLiquidationPrice = useMemo(() => {
    return disabled ? '' : makeAfterLiquidationPrice({ inputMargin, isError, type });
  }, [disabled, inputMargin, isError, type]);

  // 计算后的开仓价格
  const afterEntryPrice = useMemo(() => {
    return disabled ? '' : makeAfterEntryPrice({ inputMargin, isError, markPrice, type });
  }, [disabled, inputMargin, isError, markPrice, type]);

  return {
    inputMargin,
    avgEntryPrice,
    afterEntryPrice,
    liquidationPrice,
    afterLiquidationPrice,
    totalMargin,
    afterMargin,
    leverage: currentLeverage,
  };
};

// 返回低频更新对象
export const getAdjustProps = ({ leverage, isError, calcData, markPrice }) => {
  // 获取当前仓位的数据
  const {
    margin,
    liquidationPrice,
    avgEntryPrice,
    leverage: pLeverage,
    settleCurrency,
  } = getAppendMarginDetail();

  // 当前的总保证金
  const totalMargin = calcData?.totalMargin || margin;
  // 当前的真实杠杆
  const currentLeverage = calcData?.realLeverage || pLeverage;

  // 反推杠杆变动保证金
  const { shortPrecision: shortP } = getCurrenciesPrecision(settleCurrency);

  const inputMargin = formatNumber(
    makeLeverageToExpectMargin({ leverage, currentLeverage, totalMargin, markPrice }),
    { fixed: shortP, pointed: false },
  );

  const type = makeInputMarginToType({ inputMargin });

  // 计算后的总保证金
  const afterMargin = makeAfterMargin({ inputMargin, isError, totalMargin, type });

  // 计算后的强平价格
  const afterLiquidationPrice = makeAfterLiquidationPrice({ inputMargin, isError, type });

  // 计算后的开仓价格
  const afterEntryPrice = makeAfterEntryPrice({ inputMargin, isError, markPrice, type });

  return {
    inputMargin,
    avgEntryPrice,
    afterEntryPrice,
    liquidationPrice,
    afterLiquidationPrice,
    totalMargin,
    afterMargin,
    leverage: currentLeverage,
  };
};

export default useAdjustProps;
