/**
 * Owner: garuda@kupotech.com
 * 调整的面板
 */
import React, { useMemo } from 'react';

import { getDigit } from 'helper';
import { _t } from 'utils/lang';

import { getSymbolInfo } from '@/hooks/common/useSymbol';
import { useGetPositionCalcData } from '@/hooks/futures/useCalcData';
import { getCurrenciesPrecision } from '@/hooks/futures/useGetCurrenciesPrecision';
import { useGetAppendMarginDetail } from '@/hooks/futures/useGetFuturesPositionsInfo';
import { useMarkPrice } from '@/hooks/futures/useMarket';
import { FUTURES } from '@/meta/const';
import { styled } from '@/style/emotion';

import useAdjustProps from './useAdjustProps';

import { ResultWrapper, ResultBox, ResultItem, ResultLabel } from '../commonStyle';
import { ResultValue } from '../components';

const ResultContent = styled(ResultWrapper)`
  margin-top: 24px;
`;

const AdjustCard = ({ leverage, isError, disabled }) => {
  // 获取当前仓位的数据
  const { symbol, settleCurrency } = useGetAppendMarginDetail();

  // 获取精度
  const { precision = 8 } = getCurrenciesPrecision(settleCurrency);

  // 获取计算后的值
  const calcData = useGetPositionCalcData(symbol);

  const markPrice = useMarkPrice(symbol);

  const {
    avgEntryPrice,
    afterEntryPrice,
    liquidationPrice,
    afterLiquidationPrice,
    totalMargin,
    afterMargin,
  } = useAdjustProps({ leverage, isError, calcData, markPrice, disabled });

  // 强平价格跟开仓价格用另外一个精度
  const { indexFixed, fixed } = useMemo(() => {
    // 获取 contract
    const contract = getSymbolInfo({ symbol, tradeType: FUTURES });
    const { indexPriceTickSize, tickSize } = contract;
    const fixedIndexPrice = getDigit(indexPriceTickSize);
    const fixedPrice = getDigit(tickSize);
    return {
      indexFixed: fixedIndexPrice,
      fixed: fixedPrice,
    };
  }, [symbol]);

  return (
    <>
      <ResultContent>
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
            <ResultLabel>{_t('position.margin')}</ResultLabel>
            <ResultValue value={totalMargin} fixed={precision} />
            <ResultValue value={afterMargin} fixed={precision} />
          </ResultItem>
          <ResultItem className="result-item">
            <ResultLabel>{_t('position.liquidation')}</ResultLabel>
            <ResultValue value={liquidationPrice} fixed={indexFixed} />
            <ResultValue value={afterLiquidationPrice} fixed={indexFixed} />
          </ResultItem>
          <ResultItem className="result-item">
            <ResultLabel>{_t('position.entryPrice')}</ResultLabel>
            <ResultValue value={avgEntryPrice} fixed={fixed} />
            <ResultValue value={afterEntryPrice} fixed={fixed} />
          </ResultItem>
        </ResultBox>
      </ResultContent>
    </>
  );
};

export default React.memo(AdjustCard);
