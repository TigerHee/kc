/**
 * Owner: garuda@kupotech.com
 */
import React, { memo, useMemo } from 'react';

import clsx from 'clsx';
import Decimal from 'decimal.js';

import {
  ABC_CROSS_LEVERAGE,
  ABC_ORDER_STATISTICS,
  ABC_POSITION,
  MARGIN_MODE_ISOLATED,
  _t,
  styled,
} from '../../builtinCommon';
import { PrettyCurrency, TooltipWrapper } from '../../builtinComponents';
import { useMarginMode, useShowAbnormal } from '../../builtinHooks';

import { BUY, SELL, useFuturesForm } from '../../config';

import useCrossCost from '../../hooks/useCost/useCrossCost';
import useIsolatedCost from '../../hooks/useCost/useIsolatedCost';
import { useGetActiveTab, useGetLeverage, useGetSymbolInfo } from '../../hooks/useGetData';
import useGetUSDsUnit from '../../hooks/useGetUSDsUnit';
import useWrapperScreen from '../../hooks/useWrapperScreen';

import { SpanUnderline } from '../commonStyle';

const CostWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  .col {
    font-size: 12px;
    display: flex;
    align-items: center;
    max-width: ${(props) => (props.isMd ? '100%' : '120px')};
    width: ${(props) => (props.isMd ? '100%' : 'auto')};
    flex-wrap: wrap;
  }

  .colRight {
    justify-content: flex-end;
    .pretty-currency {
      text-align: right;
    }
  }
  .title {
    color: ${(props) => props.theme.colors.text40};
    max-width: ${(props) => (props.isMd ? '200px' : '96px')};
    display: inline-block;
    font-size: 12px;
    margin-right: 2px;
  }

  .item {
    color: ${(props) => props.theme.colors.text};
    white-space: normal;
    word-break: break-word;
  }
`;

const CostContent = memo(({ buyCost, sellCost, symbolInfo }) => {
  const { isMd } = useWrapperScreen();
  const futuresFormContext = useFuturesForm();

  return (
    <CostWrapper isMd={isMd}>
      {isMd && futuresFormContext?.side === SELL ? null : (
        <div className={'col'}>
          <TooltipWrapper title={_t('trade.tooltip.cost')}>
            <SpanUnderline className={'title'}>{_t('trade.order.cost')}</SpanUnderline>
          </TooltipWrapper>
          <span className={'item'}>
            <PrettyCurrency
              round={Decimal.ROUND_UP}
              value={buyCost}
              currency={symbolInfo?.settleCurrency}
              isShort
              placeholder="--"
            />
          </span>
        </div>
      )}
      {isMd && futuresFormContext?.side === BUY ? null : (
        <div className={clsx('col', 'colRight')}>
          <TooltipWrapper title={_t('trade.tooltip.cost')}>
            <SpanUnderline className={'title'}>{_t('trade.order.cost')}</SpanUnderline>
          </TooltipWrapper>
          <span className={'item'}>
            <PrettyCurrency
              round={Decimal.ROUND_UP}
              value={sellCost}
              currency={symbolInfo?.settleCurrency}
              isShort
              placeholder="--"
            />
          </span>
        </div>
      )}
    </CostWrapper>
  );
});

// 逐仓保证金
const IsoLatedCost = memo(({ price, size }) => {
  const { orderType } = useGetActiveTab();
  const leverage = useGetLeverage();
  const { symbolInfo } = useGetSymbolInfo();

  const { size: _size } = useGetUSDsUnit(size, price);
  const [{ cost: buyCost }, { cost: sellCost }] = useIsolatedCost({
    size: _size,
    type: orderType,
    leverage,
    price,
    symbolInfo,
  });

  return <CostContent buyCost={buyCost} sellCost={sellCost} symbolInfo={symbolInfo} />;
});

// 全仓保证金
const CrossCost = memo(({ price, size }) => {
  const { orderType } = useGetActiveTab();
  const leverage = useGetLeverage();
  const { symbolInfo } = useGetSymbolInfo();
  const showAbnormal = useShowAbnormal();
  const abnormalResult = showAbnormal({
    requiredKeys: [ABC_POSITION, ABC_CROSS_LEVERAGE, ABC_ORDER_STATISTICS],
  });
  const { size: _size } = useGetUSDsUnit(size, price);
  const [{ cost: buyCost }, { cost: sellCost }] = useCrossCost({
    size: _size,
    type: orderType,
    leverage,
    price,
    symbolInfo,
  });
  return (
    <CostContent
      buyCost={abnormalResult || buyCost}
      sellCost={abnormalResult || sellCost}
      symbolInfo={symbolInfo}
    />
  );
});

const Cost = ({ price, size }) => {
  const { symbolInfo } = useGetSymbolInfo();

  const { getMarginModeForSymbol } = useMarginMode();
  const isIsolated = useMemo(
    () => getMarginModeForSymbol(symbolInfo?.symbol) === MARGIN_MODE_ISOLATED,
    [getMarginModeForSymbol, symbolInfo],
  );

  return isIsolated ? (
    <IsoLatedCost price={price} size={size} />
  ) : (
    <CrossCost price={price} size={size} />
  );
};

export default memo(Cost);
