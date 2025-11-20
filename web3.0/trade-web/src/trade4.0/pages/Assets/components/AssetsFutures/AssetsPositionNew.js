/**
 * Owner: garuda@kupotech.com
 * 合约资产组件模块
 */

import React, { useMemo, memo } from 'react';
import { useSelector } from 'react-redux';

import clsx from 'clsx';

import {
  Decimal,
  toPercent,
} from 'helper';
import { _t } from 'utils/lang';
import { greaterThan, lessThanOrEqualTo } from 'utils/operation';

import Tooltip from '@mui/Tooltip';

import { useShowAbnormal } from '@/components/AbnormalBack/hooks';
import SymbolText from '@/components/SymbolText';

import { useGetCurrentSymbol, useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import { useGetPositionCalcData } from '@/hooks/futures/useCalcData';
import { useSwitchTrialFund } from '@/hooks/futures/useFuturesTrialFund';
import { useGetSymbolPositionsData } from '@/hooks/futures/useGetFuturesPositionsInfo';
import { MARGIN_MODE_CROSS } from '@/meta/futures';
import { calcIsolatedRiskRate } from '@/pages/Futures/calc';
import { getMarginMode } from '@/pages/Futures/components/MarginMode/hooks';

import { fx, styled } from '@/style/emotion';

import { AssetsWrapper, AssetsTitle, AssetsBox, AssetsItem, PrettyValue } from './commonStyle';

import { useGetRiskRate } from '../../../../hooks/futures/useCalcData';

const RiskSpan = styled.span`
  font-size: 12px;
  font-weight: 500;
  &.primary {
    color: ${(props) => props.theme.colors.primary};
  }
  &.secondary {
    color: ${(props) => props.theme.colors.secondary};
  }
  &.complementary {
    color: ${(props) => props.theme.colors.complementary};
  }
`;

const TrialText = styled.span`
  ${(props) => fx.color(props, 'complementary')}
  ${(props) => fx.backgroundColor(props, 'complementary8')}
  padding: 0 4px;
  border-radius: 4px;
  word-break: normal;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  margin-left: 4px;
`;

const emptyObject = {};
const AssetsPosition = memo(({ isMd }) => {
  const isLogin = useSelector((state) => state.user.isLogin);

  const currentSymbol = useGetCurrentSymbol();
  const symbolInfo = useGetCurrentSymbolInfo();

  const { switchTrialFund: isTrialFunds } = useSwitchTrialFund();

  const position = useGetSymbolPositionsData({
    symbol: currentSymbol,
    isTrialFunds,
  });

  const calcData = useGetPositionCalcData(currentSymbol);

  const {
    maintMargin,
    unrealisedPnl,
    isTrialFunds: positionTrialFunds,
    posMaint,
  } = useMemo(() => {
    if (!isLogin) return emptyObject;
    return position.symbol ? position : emptyObject;
  }, [isLogin, position]);

  const showAbnormal = useShowAbnormal();
  const marginMode = getMarginMode(symbolInfo?.symbol);
  const abnormalResult = marginMode === MARGIN_MODE_CROSS ? showAbnormal() : false;

  // 体验金仓位不需要取计算值，其余需要取计算值确保更新
  const positionMargin = useMemo(() => {
    return isTrialFunds ? maintMargin : calcData?.totalMargin || maintMargin;
  }, [calcData, isTrialFunds, maintMargin]);

  // 体验金仓位不需要取计算值，其余需要取计算值确保更新
  const positionUnPnl = useMemo(() => {
    return isTrialFunds ? unrealisedPnl : calcData?.unPnl || unrealisedPnl;
  }, [calcData, isTrialFunds, unrealisedPnl]);

  const marginRate = useGetRiskRate(currentSymbol, marginMode);

  const marginRateMap = useMemo(() => {
    if (!positionMargin) {
      return {
        riskCls: '',
        value: '--',
      };
    }
    let riskCls = 'primary';
    const marginValue = isTrialFunds
      ? calcIsolatedRiskRate({
          isolatedTotalMargin: maintMargin,
          isolatedMM: posMaint,
        })
      : marginRate;
    // 计算保证金比率 0-20% low | 20% - 60% medium | 60% - x high
    if (greaterThan(marginValue)(0.2) && lessThanOrEqualTo(marginValue)(0.6)) {
      riskCls = 'complementary';
    } else if (greaterThan(marginValue)(0.6)) {
      riskCls = 'secondary';
    }

    return {
      riskCls,
      value: toPercent(marginValue, 2, false, Decimal.ROUND_UP),
    };
  }, [isTrialFunds, maintMargin, marginRate, posMaint, positionMargin]);

  return (
    <AssetsWrapper>
      <AssetsTitle>
        <SymbolText symbol={currentSymbol} />
        {positionTrialFunds ? (
          <TrialText className="trial-fund">{_t('homepage.head.trial')}</TrialText>
        ) : null}
      </AssetsTitle>
      <AssetsBox isMd={isMd}>
        <AssetsItem className="assets-item">
          <span className="item-label">{_t('futuresAssets.positionMargin')}</span>
          <PrettyValue
            value={abnormalResult || positionMargin}
            currency={symbolInfo?.settleCurrency}
            isShort
            placeholder="--"
            round={Decimal.ROUND_UP}
          />
        </AssetsItem>
        <AssetsItem className="assets-item">
          <span className={clsx('item-label')}>{_t('futures.positon.riskRate')}</span>
          <PrettyValue>
            <RiskSpan className={marginRateMap?.riskCls}>
              {abnormalResult || marginRateMap?.value}
            </RiskSpan>
          </PrettyValue>
        </AssetsItem>
        <AssetsItem className="assets-item">
          <Tooltip title={_t('trade.tooltip.positions.unrealisedPNL')}>
            <span className={clsx('item-label', 'underline')}>
              {_t('futuresAssets.unrealisedPNL')}
            </span>
          </Tooltip>
          <PrettyValue
            value={positionUnPnl}
            currency={symbolInfo?.settleCurrency}
            isShort
            showColor
            placeholder="--"
          />
        </AssetsItem>
      </AssetsBox>
    </AssetsWrapper>
  );
});

export default memo(AssetsPosition);
