/**
 * Owner: garuda@kupotech.com
 * 调整的面板
 */
import React, { useMemo } from 'react';

import { getDigit } from 'helper';
import { _t } from 'utils/lang';
import { FUTURES } from '@/meta/const';

import { useGetPositionCalcData } from '@/hooks/futures/useCalcData';
import { useGetAppendMarginDetail } from '@/hooks/futures/useGetFuturesPositionsInfo';
import { getSymbolInfo } from '@/hooks/common/useSymbol';
import { useMarkPrice } from '@/hooks/futures/useMarket';

import { ResultValue } from '../components';
import { APPEND_TABS } from '../config';

import { ResultWrapper, ResultBox, ResultItem, ResultLabel } from '../commonStyle';
import useAdjustProps from './useAdjustProps';

const AdjustCard = ({ type, inputMargin, precision, isError }) => {
  // 获取当前仓位的数据
  const { symbol } = useGetAppendMarginDetail();

  // 获取计算后的值
  const calcData = useGetPositionCalcData(symbol);

  // 获取当前标记价格
  const markPrice = useMarkPrice(symbol);

  const {
    avgEntryPrice,
    afterEntryPrice,
    liquidationPrice,
    afterLiquidationPrice,
    totalMargin,
    afterMargin,
    leverage,
    afterRealLeverage,
  } = useAdjustProps({ inputMargin, type, isError, calcData, markPrice });

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
      <ResultWrapper>
        <ResultItem>
          <ResultLabel />
          <ResultLabel className="result-label" title={'result-label'}>
            {_t('operator.margin.current')}
          </ResultLabel>
          <ResultLabel className="result-label" title={'result-label'}>
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
            <ResultLabel>{_t('position.realLeverage')}</ResultLabel>
            <ResultValue value={leverage} type="lev" fixed={2} />
            <ResultValue value={afterRealLeverage} type="lev" fixed={2} />
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
      </ResultWrapper>
    </>
  );
};

export default React.memo(AdjustCard);
