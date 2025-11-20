/**
 * Owner: garuda@kupotech.com
 * 调整杠杆-margin 信息
 */

import React, { memo, useMemo } from 'react';

import Decimal from 'decimal.js';

import { dividedBy, multiply, lessThanOrEqualTo, equals } from 'utils/operation';

import { useShowAbnormal } from '@/components/AbnormalBack/hooks';

import { getFuturesCrossConfigForSymbol, getSymbolInfo } from '@/hooks/common/useSymbol';
import { useGetPositionCalcData, useGetCrossPosOrderMargin } from '@/hooks/futures/useCalcData';
import { getCurrenciesPrecision } from '@/hooks/futures/useGetCurrenciesPrecision';
import { FUTURES } from '@/meta/const';
import { calcIMR, calcMMR } from '@/pages/Futures/calc';

import { _t, formatNumber } from '@/pages/Futures/import';

import {
  ResultWrapper,
  ResultBox,
  ResultItem,
  ResultLabel,
  ResultItemValue,
  TooltipClx,
} from './style';

const ResultValue = memo(({ value, children, type, fixed, round }) => {
  const endUnit = type === 'lev' ? 'x' : '';
  return (
    <ResultItemValue className="result-value" value={value}>
      {value == null || value === ''
        ? '--'
        : children ||
          `${formatNumber(value, { fixed, round, pointed: true, dropZ: false })}${endUnit}`}
    </ResultItemValue>
  );
});

const ResultContent = memo(({ symbol, leverage, currentLeverage, currentPosOrderMargin }) => {
  // 获取计算后的值
  const calcData = useGetPositionCalcData(symbol);
  const symbolInfo = getSymbolInfo({ symbol, tradeType: FUTURES });
  const { shortPrecision: precision } = getCurrenciesPrecision(symbolInfo?.settleCurrency);
  const showAbnormal = useShowAbnormal();
  const abnormalResult = showAbnormal();

  const afterMargin = useMemo(() => {
    if (abnormalResult || !leverage || equals(leverage)(currentLeverage)) return abnormalResult;

    const { IMR } = calcData;
    const { f, m, mmrLimit, mmrLevConstant } = getFuturesCrossConfigForSymbol({ symbol });
    const MMR2 = calcMMR({
      maxLev: mmrLevConstant,
      m,
      mmrLimit,
      posOrderQty: calcData?.posOrderQty,
    });
    const IMR2 = calcIMR({ leverage, f, MMR2 });

    const adjustMargin = dividedBy(multiply(currentPosOrderMargin)(IMR2))(IMR)?.toString();
    return adjustMargin;
  }, [abnormalResult, calcData, currentLeverage, currentPosOrderMargin, leverage, symbol]);

  if (lessThanOrEqualTo(currentPosOrderMargin)(0)) {
    return null;
  }

  return (
    <>
      <ResultWrapper>
        <ResultItem>
          <ResultLabel />
          <ResultLabel className="result-label" title>
            {_t('operator.margin.current')}
          </ResultLabel>
          <ResultLabel className="result-label" title>
            {_t('operator.margin.after')}
          </ResultLabel>
        </ResultItem>
        <ResultBox className="result-box">
          <ResultItem className="result-item">
            <ResultLabel>
              <TooltipClx useUnderline={false} title={_t('cross.margin.tips')}>
                {_t('position.margin')}
              </TooltipClx>
            </ResultLabel>
            <ResultValue value={currentPosOrderMargin} fixed={precision} round={Decimal.ROUND_UP} />
            <ResultValue value={afterMargin} fixed={precision} round={Decimal.ROUND_UP} />
          </ResultItem>
        </ResultBox>
      </ResultWrapper>
    </>
  );
});

const MarginBox = ({ symbol, currentLeverage, leverage }) => {
  const notShowMargin = useMemo(() => {
    return !leverage || !currentLeverage;
  }, [currentLeverage, leverage]);

  const { posOrderMarginSymbol } = useGetCrossPosOrderMargin();

  const currentPosOrderMargin = useMemo(
    () => posOrderMarginSymbol[symbol],
    [posOrderMarginSymbol, symbol],
  );

  if (notShowMargin || !currentPosOrderMargin) return null;

  return (
    <ResultContent
      symbol={symbol}
      leverage={leverage}
      currentLeverage={currentLeverage}
      currentPosOrderMargin={currentPosOrderMargin}
    />
  );
};

export default memo(MarginBox);
