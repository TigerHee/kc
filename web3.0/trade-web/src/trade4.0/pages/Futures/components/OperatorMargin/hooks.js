/**
 * Owner: garuda@kupotech.com
 * 存放操作的 hooks
 */
import { useState, useCallback, useMemo } from 'react';

import Decimal from 'decimal.js';

import { trackClick } from 'src/utils/ga';
import {
  toFixed,
  multiply,
  dividedBy,
  toPow,
  greaterThan,
  toNonExponential,
} from 'utils/operation';

import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { getCurrenciesPrecision } from '@/hooks/futures/useGetCurrenciesPrecision';

import { FUTURES } from '@/meta/const';
import { ADJUST_MARGIN, SK_ADD_KEY, SK_REDUCER_KEY } from '@/meta/futuresSensors/withdraw';

import { APPEND_TABS } from './config';

// tabs hooks
export const useOperatorMarginTabs = () => {
  const [activeKey, setActiveKey] = useState(APPEND_TABS);

  const onChangeTab = useCallback((e, v) => {
    setActiveKey(v);
    // 埋点
    trackClick([ADJUST_MARGIN, '1'], {
      MarginDirection: v === APPEND_TABS ? SK_ADD_KEY : SK_REDUCER_KEY,
    });
  }, []);

  return {
    activeKey,
    onChangeTab,
  };
};

// 返回最小精度
export const useMinimumPrecision = (settleCurrency, symbol) => {
  const { takerFeeRate } = useGetSymbolInfo({ symbol, tradeType: FUTURES });

  const { shortPrecision = 8, precision = 8 } = getCurrenciesPrecision(settleCurrency);

  const inputStep = toPow(precision);
  const inputPrecision = +precision;

  const minimumMargin = useMemo(() => {
    let min = toFixed(multiply(dividedBy(1)(takerFeeRate))(1e-8))(precision, Decimal.ROUND_UP);
    min = greaterThan(min)(inputStep) ? min : inputStep;

    return toNonExponential(min);
  }, [takerFeeRate, precision, inputStep]);

  return {
    inputStep,
    inputPrecision,
    minimumMargin,
    precision,
    shortPrecision,
  };
};
